/* global document window XMLHttpRequest MutationObserver mraid */
import constants from './constants';

export default class Mads {
  constructor() {
    this.body = document.getElementsByTagName('body')[0];
    this.head = document.getElementsByTagName('head')[0];

    this.googleApiKey = 'AIzaSyCFHn5MNIYN-lGyTDTUYRAJM2fEKvHm-nE';

    // Get JSON value
    if (!constants.json && window.rma) {
      this.json = window.rma.customize.json;
    } else if (constants.json) {
      this.json = constants.json;
    } else {
      this.json = './settings.json';
    }

    // Setup & get FET value
    this.fetTracked = false;
    if (constants.fet && window.rma) {
      this.fet = typeof constants.fet === 'string' ? [window.rma.fet] : window.rma.fet;
    } else if (constants.fet) {
      this.fet = constants.fet;
    } else {
      this.fet = [];
    }

    if (constants.custTracker && window.rma) {
      this.custTracker = window.rma.customize.custTracker;
    } else if (constants.custTracker) {
      this.custTracker = constants.custTracker;
    } else {
      this.custTracker = [];
    }

    if (constants.ct && window.rma) {
      this.ct = window.rma.ct;
    } else if (constants.ct) {
      this.ct = constants.ct;
    } else {
      this.ct = [];
    }

    if (constants.cte && window.rma) {
      this.cte = window.rma.cte;
    } else if (constants.cte) {
      this.cte = constants.cte;
    } else {
      this.cte = [];
    }

    if (constants.tags && window.rma) {
      this.tags = this.processTags(window.rma.tags);
    } else if (constants.tags) {
      this.tags = this.processTags(constants.tags);
    } else {
      this.tags = {};
    }

    this.id = this.generateUniqueId();
    this.tracked = [];
    this.trackedEngagementType = [];
    this.engagementTypeExclude = [];
    this.firstEngagementTracked = false;
    this.content = document.getElementById('rma-widget');
    this.path = typeof window.rma !== 'undefined' ? window.rma.customize.src : '';
    for (let i = 0; i < this.custTracker.length; i += 1) {
      if (this.custTracker[i].indexOf('{2}') !== -1) {
        this.custTracker[i] = this.custTracker[i].replace('{2}', '{{type}}');
      }
    }
    this.elems = {};

    if (typeof this.json === 'string' && (this.json.indexOf('./') === 0 || this.json.indexOf('https://') === 0 || this.json.indexOf('http://') === 0)) {
      const xhr = new XMLHttpRequest();
      xhr.onreadystatechange = () => {
        if (xhr.readyState === XMLHttpRequest.DONE) {
          if (xhr.status === 200) {
            this.data = JSON.parse(xhr.responseText);
            this.loadAd();
          } else {
            console.log('There was problem with the request.'); // eslint-disable-line
          }
        }
      };
      xhr.open('GET', this.json, true);
      xhr.send();
    } else {
      this.data = constants.json;
      this.loadAd();
    }
  }

  loadAd() {
    const obs = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.target === this.content) {
          this.content.querySelectorAll('*').forEach((elem) => {
            if (elem.id) {
              this.elems[elem.id] = elem;
            }
          });
          if (this.postRender) this.postRender();
          this.events();
          obs.disconnect();
        }
      });
    });

    const config = { childList: true };

    obs.observe(this.content, config);

    this.content.innerHTML = this.render().replace(/src="/g, `src="${this.path}`);

    const defaultStyles = 'body{padding:0;margin:0;}';
    this.loadCSS(defaultStyles);
    const style = this.style();
    if (typeof style === 'string') {
      this.loadCSS(style);
    } else {
      style.forEach(_style => this.loadCSS(_style));
    }
  }

  resolve(path) {
    return this.path + path;
  }

  generateUniqueId() { // eslint-disable-line class-methods-use-this
    return +new Date();
  }

  processTags(tags) {
    const tmpTags = tags || this.tags;
    let resultTags = '';
    Object.keys(tmpTags).forEach((tag) => {
      if (tmpTags[tag]) {
        resultTags += `&${tag}=${tmpTags[tag]}`;
      }
    });

    return resultTags;
  }

  linkOpener(url) {
    let tmpUrl = url;
    if (typeof tmpUrl !== 'undefined' && tmpUrl !== '') {
      if (typeof this.ct !== 'undefined' && this.ct !== '' && this.ct.length !== 0) {
        tmpUrl = this.ct + encodeURIComponent(tmpUrl);
        this.url = tmpUrl;
      }

      if (typeof mraid !== 'undefined') {
        mraid.open(tmpUrl);
      } else {
        window.open(tmpUrl);
      }

      if (typeof this.cte !== 'undefined' && this.cte !== '') {
        this.imageTracker(this.cte);
      }
    }
  }

  tracker(tt, type, name, value) {
    const tmpName = name || type;
    let tmpValue = value;

    if (tt === 'E' && !this.fetTracked) {
      for (let i = 0; i < this.fet.length; i += 1) {
        const t = document.createElement('img');
        t.src = this.fet[i];

        t.style.display = 'none';
        this.body.appendChild(t);
      }
      this.fetTracked = true;
    }

    if (typeof this.custTracker !== 'undefined' && this.custTracker !== '' && this.tracked.indexOf(tmpName) === -1) {
      for (let i = 0; i < this.custTracker.length; i += 1) {
        const img = document.createElement('img');

        if (typeof tmpValue === 'undefined') {
          tmpValue = '';
        }

        let src = this.custTracker[i].replace('{{rmatype}}', type);
        src = src.replace('{{rmavalue}}', tmpValue);

        if (this.trackedEngagementType.indexOf(tt) !== -1
          || this.engagementTypeExclude.indexOf(tt) !== -1) {
          src = src.replace('tt={{rmatt}}', '');
        } else {
          src = src.replace('{{rmatt}}', tt);
          this.trackedEngagementType.push(tt);
        }

        if (!this.firstEngagementTracked && tt === 'E') {
          src += '&ty=E';
          this.firstEngagementTracked = true;
        }

        img.src = `${src + this.tags}&${this.id}`;

        img.style.display = 'none';
        this.body.appendChild(img);

        this.tracked.push(tmpName);
      }
    }
  }

  imageTracker(url) {
    for (let i = 0; i < url.length; i += 1) {
      const t = document.createElement('img');
      t.src = url[i];

      t.style.display = 'none';
      this.body.appendChild(t);
    }
  }

  loadJS(url) {
    return new Promise((resolve, reject) => {
      try {
        const script = document.createElement('script');
        script.src = url;
        this.head.appendChild(script);
        script.onload = () => {
          resolve(true);
        };
      } catch (e) {
        reject(e);
      }
    });
  }

  generateShortUrl(url) {
    return new Promise((resolve, reject) => {
      if (this.shortUrl) {
        resolve(JSON.stringify({ id: this.shortUrl }));
      } else {
        try {
          const xhr = new XMLHttpRequest();
          xhr.open('POST', `https://www.googleapis.com/urlshortener/v1/url?key=${this.googleApiKey}`);
          xhr.setRequestHeader('content-type', 'application/json');
          xhr.onreadystatechange = () => {
            if (xhr.readyState === 4 && xhr.status === 200) {
              resolve(xhr.responseText);
            }
          };
          xhr.send(JSON.stringify({ longUrl: url }));
        } catch (e) {
          reject(e);
        }
      }
    });
  }

  loadCSS(url) {
    return new Promise((resolve, reject) => {
      try {
        if (url.indexOf('http') === 0) {
          const link = document.createElement('link');
          link.href = url;
          link.setAttribute('type', 'text/css');
          link.setAttribute('rel', 'stylesheet');
          this.head.appendChild(link);
        } else {
          const cssText = url.replace(/(<br>)/g, '');
          const style = document.createElement('style');
          style.innerText = cssText;
          this.head.appendChild(style);
        }

        resolve(true);
      } catch (e) {
        reject(e);
      }
    });
  }
}
