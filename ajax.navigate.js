var navOptions = {
    duration: 500,
    openDirection: 'left',
    closeDirection: 'right'
}

navRequest = function (url, callback) {
    var xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            callback(this.response);
        }
    }

    xhr.open('GET', url, true);
    xhr.send();
}

setTransform = function (first, last) {
    transformObj = [
        {transform: first},
        {transform: last}
    ];
}

sliding = function(_this, action, direction) {
    if (action == 'open') {
        switch (direction) {
            case 'left':
                setTransform('translateX(100%)', 'translateX(0)');
                break;
            case 'right':
                setTransform('translateX(-100%)', 'translateX(0)');
                break;
            case 'up':
                setTransform('translateY(100%)', 'translateY(0)');
                break;
            case 'down':
                setTransform('translateY(-100%)', 'translateY(0)');
                break;
        }
        var hideElement = false;
    } else if (action == 'close') {
        switch (direction) {
            case 'left':
                setTransform('translateX(0)', 'translateX(-100%)');
                break;
            case 'right':
                setTransform('translateX(0)', 'translateX(100%)');
                break;
            case 'up':
                setTransform('translateY(0)', 'translateY(-100%)');
                break;
            case 'down':
                setTransform('translateY(0)', 'translateY(100%)');
                break;
        }
        var hideElement = true;
    }

    _this.animate(transformObj,{
        duration: navOptions.duration,
        easing: 'ease-in-out'
    });

    if (hideElement)
        setTimeout(function () {
            _this.remove();
        }, navOptions.duration);
}

closePage = function (_this) {
    if (_this.parentNode.classList.value.indexOf('ajax-navigate-page') === -1) {
        closePage(_this.parentNode);
    } else {
        sliding(_this.parentNode, 'close', closeDirection);
    }
}

getElements = function () {
    var closeLinks = document.getElementsByClassName('ajax-navigate-close');

    for (var i=0; i<closeLinks.length; i++) {
        closeLinks[i].addEventListener('click', function (e) {
            e.preventDefault();
            closeDirection = this.getAttribute('data-direction') ? this.getAttribute('data-direction') : navOptions.closeDirection;
            closePage(this);
        });
    }
}

document.addEventListener('DOMContentLoaded', function () {
    var navLinks = document.getElementsByClassName('ajax-navigate');
    var body = document.getElementsByTagName('body')[0];
    var bodyStyles = window.getComputedStyle(body);
    var bodyBackground, transformObj, closeDirection;

    for (key in bodyStyles) {
        if (key == 'background')
            bodyBackground = bodyStyles[key];
    }

    for (var i=0; i<navLinks.length; i++) {
        navLinks[i].addEventListener('click', function (e) {
            e.preventDefault();

            var direction = this.getAttribute('data-direction') ? this.getAttribute('data-direction') : navOptions.openDirection;

            navRequest(this.getAttribute('href'), function (response) {
                var page = document.createElement('div');
                page.classList.add('ajax-navigate-page');
                page.style.background = bodyBackground;
                page.innerHTML = response;

                body.appendChild(page);

                sliding(page, 'open', direction);

                getElements();
            });
        });
    }

    getElements();
});