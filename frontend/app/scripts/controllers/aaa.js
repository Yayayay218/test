function createAdDisplayContainer() {
    adDisplayContainer = new google.ima.AdDisplayContainer(document.getElementById("adContainer"))
}

function requestAds() {
    createAdDisplayContainer(), adDisplayContainer.initialize(), adsLoader = new google.ima.AdsLoader(adDisplayContainer), adsLoader.addEventListener(google.ima.AdsManagerLoadedEvent.Type.ADS_MANAGER_LOADED, onAdsManagerLoaded, !1), adsLoader.addEventListener(google.ima.AdErrorEvent.Type.AD_ERROR, onAdError, !1);
    var e = new google.ima.AdsRequest;
    console.log(url_ads), e.adTagUrl = url_ads, e.linearAdSlotWidth = width_ads, e.linearAdSlotHeight = height_ads, e.nonLinearAdSlotWidth = width_ads, e.nonLinearAdSlotHeight = height_ads, adsLoader.requestAds(e)
}

function onAdsManagerLoaded(e) {
    adsManager = e.getAdsManager(videoContent), adsManager.addEventListener(google.ima.AdErrorEvent.Type.AD_ERROR, onAdError), adsManager.addEventListener(google.ima.AdEvent.Type.CONTENT_PAUSE_REQUESTED, onContentPauseRequested), adsManager.addEventListener(google.ima.AdEvent.Type.CONTENT_RESUME_REQUESTED, onContentResumeRequested), adsManager.addEventListener(google.ima.AdEvent.Type.ALL_ADS_COMPLETED, onAdEvent), adsManager.addEventListener(google.ima.AdEvent.Type.LOADED, onAdEvent), adsManager.addEventListener(google.ima.AdEvent.Type.STARTED, onAdEvent), adsManager.addEventListener(google.ima.AdEvent.Type.COMPLETE, onAdEvent), adsManager.addEventListener(google.ima.AdEvent.Type.CLICK, onAdEvent), adsManager.addEventListener(google.ima.AdEvent.Type.USER_CLOSE, onAdEvent);
    try {
        adsManager.init(width_ads, heightGame, google.ima.ViewMode.NORMAL), adsManager.start()
    } catch (a) {
        skipAds()
    }
}

function onAdEvent(e) {
    var a = e.getAd();
    switch (e.type) {
        case google.ima.AdEvent.Type.LOADED:
            a.isLinear(), ads_load();
            break;
        case google.ima.AdEvent.Type.STARTED:
            a.isLinear() && (intervalTimer = setInterval(function () {
                adsManager.getRemainingTime()
            }, 300));
            break;
        case google.ima.AdEvent.Type.COMPLETE:
            a.isLinear() && clearInterval(intervalTimer);
            break;
        case google.ima.AdEvent.Type.CLICK:
            clickAds();
            break;
        case google.ima.AdEvent.Type.USER_CLOSE:
            close_ads()
    }
}

function onAdError(e) {
    console.log(e.getError()), skipAds(), adsManager.destroy()
}

function onContentPauseRequested() {
}

function onContentResumeRequested() {
    skipAds()
}

function clickAds() {
    var e = 0;
    1 == id_ads ? e = dataYlinkee.tag_01.value : 2 == id_ads ? e = dataYlinkee.tag_02.value : 3 == id_ads && (e = dataYlinkee.tag_03.value);
    var a = window.location.href, n = a.split("/"), d = n[n.length - 1], t = d.split("?");
    t.length > 1 && (d = t[0]), fbq("track", "ClickAds", {
        siteUrl: a,
        content_ID: d,
        value: e,
        currency: "USD",
        adsNumber: id_ads
    }), fbq("track", "Purchase", {siteUrl: a, content_ID: d, value: e, currency: "USD", adsNumber: id_ads})
}

function ads_load() {
    console.log("ads done load")
}

function close_ads() {
    skipAds(), id_ads++
}

var adsManager, adsLoader, adDisplayContainer, intervalTimer, videoContent = document.getElementById("contentElement"),
    id_ads = 1;