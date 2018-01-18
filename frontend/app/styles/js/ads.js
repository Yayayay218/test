// Copyright 2013 Google Inc. All Rights Reserved.
// You may study, modify, and use this example for any purpose.
// Note that this example is provided "as is", WITHOUT WARRANTY
// of any kind either expressed or implied.

var adsManager;
var adsLoader;
var adDisplayContainer;
var intervalTimer;
var videoContent;

// var videoContent = document.getElementById('contentElement');

function init() {
    videoContent = document.getElementById('contentElement');
    setUpIMA();
}

function setUpIMA() {
    // Create the ad display container.
    createAdDisplayContainer();
    // videoContent.load();
    adDisplayContainer.initialize();

    // Create ads loader.
    adsLoader = new google.ima.AdsLoader(adDisplayContainer);
    adsLoader.getSettings().setDisableCustomPlaybackForIOS10Plus(true);
    // Listen and respond to ads loaded and error events.
    adsLoader.addEventListener(
        google.ima.AdsManagerLoadedEvent.Type.ADS_MANAGER_LOADED,
        onAdsManagerLoaded,
        false);
    adsLoader.addEventListener(
        google.ima.AdErrorEvent.Type.AD_ERROR,
        onAdError,
        false);

    // An event listener to tell the SDK that our content video
    // is completed so the SDK can play any post-roll ads.
    // var contentEndedListener = function () {
    // console.log('ended');
    adsLoader.contentComplete();
    // };
    // videoContent.onended = contentEndedListener;

    // Request video ads.
    var adsRequest = new google.ima.AdsRequest();
    adsRequest.adTagUrl = url_ads;
    // Specify the linear and nonlinear slot sizes. This helps the SDK to
    // select the correct creative if multiple are returned.
    adsRequest.linearAdSlotWidth = width_ads;
    adsRequest.linearAdSlotHeight = height_ads;

    adsRequest.nonLinearAdSlotWidth = width_ads;
    adsRequest.nonLinearAdSlotHeight = height_ads;

    adsLoader.requestAds(adsRequest);
}


function createAdDisplayContainer() {
    // We assume the adContainer is the DOM id of the element that will house
    // the ads.
    adDisplayContainer = new google.ima.AdDisplayContainer(
        document.getElementById('adContainer'), videoContent);
}

function playAds() {
    // Initialize the container. Must be done via a user action on mobile devices.
    // videoContent.load();
    adDisplayContainer.initialize();

    try {
        // Initialize the ads manager. Ad rules playlist will start at this time.
        adsManager.init(width_ads, heightGame, google.ima.ViewMode.NORMAL);
        // Call play to start showing the ad. Single video and overlay ads will
        // start at this time; the call will be ignored for ad rules.
        adsManager.start();
    } catch (adError) {
        // An error may be thrown if there was a problem with the VAST response.
        skipAds()
    }
}

function onAdsManagerLoaded(adsManagerLoadedEvent) {
    // Get the ads manager.
    // var adsRenderingSettings = new google.ima.AdsRenderingSettings();
    // adsRenderingSettings.restoreCustomPlaybackStateOnAdBreakComplete = true;
    // videoContent should be set to the content video element.
    adsManager = adsManagerLoadedEvent.getAdsManager(
        videoContent);

    // Add listeners to the required events.
    adsManager.addEventListener(
        google.ima.AdErrorEvent.Type.AD_ERROR,
        onAdError);
    adsManager.addEventListener(
        google.ima.AdEvent.Type.CONTENT_PAUSE_REQUESTED,
        onContentPauseRequested);
    adsManager.addEventListener(
        google.ima.AdEvent.Type.CONTENT_RESUME_REQUESTED,
        onContentResumeRequested);
    adsManager.addEventListener(
        google.ima.AdEvent.Type.ALL_ADS_COMPLETED,
        onAdEvent);

    // Listen to any additional events, if necessary.
    adsManager.addEventListener(
        google.ima.AdEvent.Type.LOADED,
        onAdEvent);
    adsManager.addEventListener(
        google.ima.AdEvent.Type.STARTED,
        onAdEvent);
    adsManager.addEventListener(
        google.ima.AdEvent.Type.COMPLETE,
        onAdEvent);
    adsManager.addEventListener(google.ima.AdEvent.Type.USER_CLOSE,
        onAdEvent);
    try {
        // Initialize the ads manager. Ad rules playlist will start at this time.
        adsManager.init(width_ads, heightGame, google.ima.ViewMode.NORMAL);
        // Call play to start showing the ad. Single video and overlay ads will
        // start at this time; the call will be ignored for ad rules.
        adsManager.start();
    } catch (adError) {
        // An error may be thrown if there was a problem with the VAST response.
        skipAds()
    }
}

function onAdEvent(adEvent) {
    // Retrieve the ad from the event. Some events (e.g. ALL_ADS_COMPLETED)
    // don't have ad object associated.
    var ad = adEvent.getAd();
    switch (adEvent.type) {
        case google.ima.AdEvent.Type.LOADED:
            // This is the first event sent for an ad - it is possible to
            // determine whether the ad is a video ad or an overlay.
            ad.isLinear();
            break;
        case google.ima.AdEvent.Type.STARTED:
            // This event indicates the ad has started - the video player
            // can adjust the UI, for example display a pause button and
            // remaining time.
            // console.log(ima.AdsManager.isCustomClickTrackingUsed)
            ad.isLinear() && (intervalTimer = setInterval(function () {
                adsManager.getRemainingTime()
            }, 300));
            break;
        case google.ima.AdEvent.Type.COMPLETE:
            // This event indicates the ad has finished - the video player
            // can perform appropriate UI actions, such as removing the timer for
            // remaining time detection.
            ad.isLinear() && clearInterval(intervalTimer);
            break;
        case google.ima.AdEvent.Type.USER_CLOSE:
            skipAds()
    }
}

function onAdError(adErrorEvent) {
    // Handle the error logging.
    console.log(adErrorEvent.getError());
    skipAds();
    adsManager.destroy();
}

// var contentEndedListener = function() {adsLoader.contentComplete();};
// videoContent.addEventListener('ended', contentEndedListener);
//
// function onContentPauseRequested() {
//     videoContent.removeEventListener('ended', contentEndedListener);
// }
//
// function onContentResumeRequested() {
//     videoContent.addEventListener('ended', contentEndedListener);
// }

function onContentPauseRequested() {
    // videoContent.pause();
    // This function is where you should setup UI for showing ads (e.g.
    // display ad timer countdown, disable seeking etc.)
    // console.log('a')
}

function onContentResumeRequested() {
    skipAds()
    // videoContent.play();
    // This function is where you should ensure that your UI is ready
    // to play content. It is the responsibility of the Publisher to
    // implement this function when necessary.

}

// Wire UI element references and UI event listeners.
init();