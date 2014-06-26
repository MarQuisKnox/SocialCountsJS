/*
   SocialCountsJS widgets common JavaScript
   - Written by Seon-Wook Park (http://www.swook.net/)
   - Licensed under LGPLv3
*/

(function(w) {
  // Get URL query parameters
  var query = {};
  {
    var qstr = window.location.search ? window.location.search.slice(1): "";
    if (qstr) {
      var qstrs = qstr.split("=");
      for (var i = 1; i < qstrs.length; i += 2) {
        query[qstrs[i - 1]] = qstrs[i];
      }
    }
  }

  // Get URL from "url" url parameter or from window location
  var url = "";
  if ("url" in query) {
    url = query["url"];
  } else {
    url = document.referrer ? document.referrer : parent.location.href;
  }
  var eurl = encodeURIComponent(url);

  // Default configuration options
  var def_cfg = {
    "svcs": ["facebook", "twitter", "googleplus", "pinterest", "linkedin", "stumbleupon"],
    "fmt":  "short",
  };

  // Parse config as necessary
  var cfg = {};
  {
    var val = null;
    for (var cfgn in def_cfg) {
      val = query[cfgn];

      // Some corrections depending on option
      if (val !== undefined) {
        if (cfgn === "svcs") val = val.split(",");
      }

      if (val === undefined) cfg[cfgn] = def_cfg[cfgn];
      else                   cfg[cfgn] = val;
    }
  }

  // Social Network configurations
  var sn_cfg = {
    googleplus: {
      name: "Google+",
      cdesc: "+1s", cdescs: "+1",
      stxt: "Share",
      surl: "https://plus.google.com/share?url="
    },
    facebook: {
      name: "Facebook",
      cdesc: "likes", cdescs: "like",
      stxt: "Share",
      surl: "http://www.facebook.com/sharer/sharer.php?u="
    },
    twitter: {
      name: "Twitter",
      cdesc: "tweets", cdescs: "tweet",
      stxt: "Tweet",
      surl: "http://twitter.com/share?url="
    },
    linkedin: {
      name: "LinkedIn",
      cdesc: "shares", cdescs: "share",
      stxt: "Share",
      surl: "http://www.linkedin.com/shareArticle?url="
    },
    reddit: {
      name: "Reddit",
      cdesc: "points", cdescs: "point",
      stxt: "Share",
      surl: "http://www.reddit.com/submit?url="
    },
    stumbleupon: {
      name: "StumbleUpon",
      cdesc: "stumbles", cdescs: "stumble",
      stxt: "Stumble",
      surl: "https://www.stumbleupon.com/submit?url="
    },
    delicious: {
      name: "Delicious",
      cdesc: "bookmarks", cdescs: "bookmark",
      stxt: "Save",
      surl: "https://delicious.com/save?url="
    },
    pinterest: {
      name: "Pinterest",
      cdesc: "pins", cdescs: "pin",
      stxt: "Pin",
      surl: "http://pinterest.com/pin/create/button/?url="
    }
  };

  // Interaction handlers
  var onclickShare = function(svc) {
    window.open(svc.surl + encodeURIComponent(url));
  };

  // Store DOMElement references per social network.
  //
  // A widget can set settings by declaring variables such as:
  //   black      = true:     Use black icons
  //   widgetType = "Button": Use iFrame buttons instead of share links
  //
  var svcs = [];
  {
    var svc,
        el,
        tmpl = _.template("<img class=\"icon\" src=\"img/<%= shortName %>-64" +
                          ("black" in window && window.black === true ? "-black" : "") +
                          ".png\">" +
                          "<span class=\"counts\">&#x22EF;</span>" +
                          "<span class=\"clabel\"></span>" +
                          "<span class=\"sharelbl\"></span>");
    _.each(cfg.svcs, function(sn) {
      if (!(sn in sn_cfg)) return;
      sn_cfg[sn].shortName = sn;

      // Create button/icon
      el               = document.createElement("div");
      el.id            = sn;
      el.className     = "social";
      el.innerHTML     = tmpl(sn_cfg[sn]);
      document.body.appendChild(el);

      // Set references to sub elements
      svc = {
        el: el,
        c:  el.getElementsByClassName("counts")[0],
        cl: el.getElementsByClassName("clabel")[0],
        sl: el.getElementsByClassName("sharelbl")[0]
      };
      _.extend(svc, sn_cfg[sn]);

      // Set share text
      svc.sl.innerHTML = svc.stxt;
      svc.cl.innerHTML = svc.cdesc;

      if ("widgetType" in window && window.widgetType === "Button") {
        // Set hover handler for placing button iframe
      } else {
        // Set click handler for sharing
        el.onclick = onclickShare.bind(el, svc);
      }

      // Add to list
      svcs.push(svc);
    });
  };

  // updateCounts queries SocialCountsJS and updates on-screen counts
  var updateCounts = function() {
    var c;
    socialcounts(url, function(data) {
      // Apply formatting to received numbers
      data = socialcounts.fmt[cfg.fmt](data);

      // Show numbers on page
      _.each(svcs, function(svc) {
        c = data.counts[svc.shortName];
        svc.c.innerHTML = c;
        if (c === "1") svc.cl.innerHTML = svc.cdescs;
        else           svc.cl.innerHTML = svc.cdesc;
      });
    });
  };

  // Arrange queries
  setTimeout(function() {
    updateCounts();
    setInterval(updateCounts, 300000); // Check every 300s (5 min)
  }, 500);                             // 500ms delayed initial query

})(window, null);
