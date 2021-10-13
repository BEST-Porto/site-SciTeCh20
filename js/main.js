'use strict';
// var mainDocument = $(document);

// init foundation
// $(document).foundation();
function dateClockSetup() {
    //TODO RETIFICAR DATAS
    let competitionDate = "11" + "/" + "12" + "/" + "2020" + ' 13:30:00';
    let enrollementDate = "10" + "/" + "9" + "/" + "2019" + ' 00:00:00';
    let enrollbtn = document.getElementById("enrollbtn");
    let enrolmentDateToCompare = new Date(2019, 11, 12, 0, 0, 0, 0);
    let nowDate = new Date(Date.now() - (new Date()).getTimezoneOffset());
    let dateToReturn;

    if (nowDate < enrolmentDateToCompare) {
        enrollbtn.style.visibility = "hidden";
        dateToReturn = enrollementDate;
    } else {
        enrollbtn.setAttribute("href", "https://forms.gle/yE9d2BFQ6x1ADr6V9");
        dateToReturn = competitionDate;
    }

    return dateToReturn;
}
// Init all plugin when document is ready 
$(document).on('ready', function() {
    // 0. Init console to avoid error
    var method;
    var noop = function() {};
    var methods = [
        'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
        'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
        'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
        'timeStamp', 'trace', 'warn'
    ];
    var length = methods.length;
    var console = (window.console = window.console || {});
    var contextWindow = $(window);
    var $root = $('html, body');
    while (length--) {
        method = methods[length];
        // Only stub undefined methods.
        if (!console[method]) {
            console[method] = noop;
        }
    }

    // 1. Background image as data attribut 
    var list = $('.bg-img');
    for (var i = 0; i < list.length; i++) {
        var src = list[i].getAttribute('data-image-src');
        list[i].style.backgroundImage = "url('" + src + "')";
        list[i].style.backgroundRepeat = "no-repeat";
        list[i].style.backgroundPosition = "center";
        list[i].style.backgroundSize = "cover";
    }
    // Background color as data attribut
    var list = $('.bg-color');
    for (var i = 0; i < list.length; i++) {
        var src = list[i].getAttribute('data-bgcolor');
        list[i].style.backgroundColor = src;
    }

    // 2. Init Coutdown clock
    try {
        // check if clock is initialised
        $('.countdown').downCount({
            date: dateClockSetup(),
            offset: +11
        });
    } catch (error) {
        // Clock error : clock is unavailable
        console.log("clock disabled/unavailable");
    }




    // 3 Slideshow slider
    var imageList = $('.slide-show .img');
    var imageSlides = [];
    for (var i = 0; i < imageList.length; i++) {
        var src = imageList[i].getAttribute('data-src');
        imageSlides.push({
            src: src
        });
    }
    $('.slide-show').vegas({
        delay: 5000,
        shuffle: true,
        slides: imageSlides,
        animation: ['kenburnsUp', 'kenburnsDown', 'kenburnsLeft', 'kenburnsRight']
    });


    // 4. Prepare content for animation
    $('.section .content .anim.anim-wrapped').wrap("<span class='anim-wrapper'></span>");

    // 5. Init fullPage.js plugin
    var pageSectionDivs = $('.page-fullpage .section');
    var headerContainer = $('.hh-header');
    var slideElem = $('.slide');
    var arrowElem = $('.p-footer .arrow-d');
    var pageElem = $('.section');
    var pageSections = [];
    var pageAnchors = [];
    var mainPage = $('#mainpage');
    var scrollOverflow = true;
    var css3 = true;
    // disable scroll overflow on small device
    if (contextWindow.width() < 800) {
        scrollOverflow = false;
        css3 = false;
    }
    if (contextWindow.height() < 800) {
        scrollOverflow = false;
        css3 = false;
    }
    // Get sections name
    for (var i = 0; i < pageSectionDivs.length; i++) {
        pageSections.push(pageSectionDivs[i]);
    }
    window.asyncEach(pageSections, function(pageSection, cb) {
        var anchor = pageSection.getAttribute('data-section');
        pageAnchors.push(anchor + "");
        cb();
    }, function(err) {
        // Init plugin
        if (mainPage.width()) {
            // config fullpage.js
            mainPage.fullpage({
                menu: '#qmenu',
                anchors: pageAnchors,
                verticalCentered: false,
                css3: css3,
                navigation: true,
                responsiveWidth: 601,
                responsiveHeight: 480,
                scrollOverflow: scrollOverflow,
                scrollOverflowOptions: {
                    click: true,
                    submit: true,
                },
                normalScrollElements: '.section .scrollable',
                afterRender: function() {

                    // Fix for internet explorer : adjust content height
                    // Detect IE 6-11
                    var isIE = /*@cc_on!@*/ false || !!document.documentMode;
                    if (isIE) {
                        var contentColumns = $('.section .content .c-columns');
                        contentColumns.height(contextWindow.height())
                        for (var i = 0; i < contentColumns.length; i++) {
                            if (contentColumns[i].height <= contextWindow.height()) {
                                contentColumns[i].style.height = "100vh";
                            }
                        }
                    }


                },
                afterResize: function() {
                    var pluginContainer = $(this);
                    $.fn.fullpage.reBuild();
                },
                onLeave: function(index, nextIndex, direction) {
                    // Behavior when a full page is leaved
                    arrowElem.addClass('gone');
                    pageElem.addClass('transition');
                    slideElem.removeClass('transition');
                    pageElem.removeClass('transition');
                },
                afterLoad: function(anchorLink, index) {
                    // Behavior after a full page is loaded
                    // hide or show clock
                    if ($('.section.active').hasClass('hide-clock')) {
                        headerContainer.addClass('gone');
                    } else {
                        headerContainer.removeClass('gone');
                    }
                }
            });

        }
    });
    // Scroll to fullPage.js next/previous section
    $('.scrolldown a, .scroll.down').on('click', function() {
        try {
            // fullpage scroll
            $.fn.fullpage.moveSectionDown();
        } catch (error) {
            // normal scroll
            $root.animate({
                scrollTop: window.innerHeight
            }, 400, function() {});
        }

    });

    // 6. Hide some ui on scroll
    var scrollHeight = $(document).height() - contextWindow.height();
    contextWindow.on('scroll', function() {
        var scrollpos = $(this).scrollTop();
        var siteHeaderFooter = $('.page-footer, .page-header');

        // if (scrollpos > 10 && scrollpos < scrollHeight - 100) {
        if (scrollpos > 100) {
            siteHeaderFooter.addClass("scrolled");
        } else {
            siteHeaderFooter.removeClass("scrolled");
        }
    });


    // 7. Page Loader : hide loader when all are loaded
    contextWindow.on('load', function() {
        $('#page-loader').addClass('p-hidden');
        $('.section').addClass('anim');
    });


});
