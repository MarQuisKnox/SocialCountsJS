/*
   SocialCountsJS
   - Written by Seon-Wook Park (http://www.swook.net/)
   - First released on 25th January 2014

   ---
   This program is free software: you can redistribute it and/or modify
   it under the terms of the GNU General Public License as published by
   the Free Software Foundation, either version 3 of the License, or
   (at your option) any later version.

   This program is distributed in the hope that it will be useful,
   but WITHOUT ANY WARRANTY; without even the implied warranty of
   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
   GNU General Public License for more details.

   You should have received a copy of the GNU General Public License
   along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

/*! SocialCountsJS / @author: Seon-Wook Park / @license: LGPLv3 */

(function(){
	var prot_chk   = /^[htfps]+:\/\/.*/,

	    // URL to Open Data Table
	    odt_url    = 'http://swook.github.io/SocialCountsJS/socialcounts.xml',

	    // Function which processes jsonp responses
	    listenerId = 'socialcounts_receiver',

	    // URL elements to use in constructing final query URL
	    qurl_pre   = 'http://query.yahooapis.com/v1/public/yql?q=USE%20%27',
	    qurl_post  = '%27%3B&format=json&callback='+ listenerId,

	    // List of pending jobs
	    job_list  = [];

	// Add URL to Open Data Table (ODT) file.
	qurl_pre += encodeURIComponent(odt_url) +'%27%20AS%20tbl%3B%20SELECT%20*%20FROM%20tbl%20WHERE%20url%3D%27';

	// Main function, used by providing url (optional) and function to run
	// post-request. Function f takes one parameter, an object:
	// {
	// 	url: <Request URL>,
	// 	counts: {
	// 		googleplus: 123,
	// 		facebook:   456,
	// 		[...]
	// 	}
	// }
	window.socialcounts = function () {
		var url, f;
		if (typeof arguments[0] == 'function') {
			url = document.location.href;
			f   = arguments[0];
		} else if (typeof arguments[0] == 'string' && typeof arguments[1] == 'function') {
			url = arguments[0];
			f   = arguments[1];
		} else {
			console.error('socialcounts: invalid input parameters.');
			return;
		}

		// Attempt to reduce duplicate urls...
		//var l = url.length;
		//if (url[l - 1] == '/') url = url.slice(0, -1);
		if (!prot_chk.test(url)) url = 'http://'+ url;

		// Generate function name for function calling on response
		var r = document.createElement('script'),
		    t = new Date();

		// Construct temporary script DOM object for jsonp with YQL
		r.type = 'text/javascript';
		r.id   = 'sc'+ (t).getTime() +'_'+ Math.round(Math.random() * 1e6);
		r.src  = qurl_pre + encodeURIComponent(url) + qurl_post;
		document.body.appendChild(r);

		// Push function parameter f and input url to job_list
		job_list.push({
			url:    url,
			func:   f,
			sel_id: r.id,
			subt:   t,
			trial:  1
		});
	}

	// window[listenerId] responds to jsonp requests made for SocialCountsJS
	window[listenerId] = function (data) {
		if ('query' in data && 'results' in data.query) {
			var r = data.query.results.result;
			// For some reason YQL won't show numbers as numbers... gotta parse em.
			for (var sn in r.counts) {
				r.counts[sn] = parseFloat(r.counts[sn]);
			}

			// Pop func to run from list of funcs
			var j = null, n = job_list.length;
			for (var i = 0; i < n; i++) {
				// Retrieve a job
				j = job_list.pop();

				// Return job to queue if not requested url in this job
				if (r.url != j.url) {
					job_list.push(j);
					continue;
				}

				// Remove temporary script element
				document.body.removeChild(document.getElementById(j.sel_id));

				// Run provided function
				j.func(r);
			}
		}
	}
})(null);
