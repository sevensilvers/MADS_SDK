import constants from './constants';

export default class Mads {
  constructor(opt) {
    // this.render = opt.render;
    this.body = document.getElementsByTagName('body')[0];
    this.head = document.getElementsByTagName('head')[0];

    // Get JSON value
    if (!constants.json && window.rma) {
      this.json = window.rma.customize.json;
    } else if (constants.json) {
      this.json = constants.json;
    } else {
      this.json = '/settings.json'
    }

    if (this.json.indexOf('/') === 0) {
      // get(this.json).then((resp) => {
      //   this.data = resp.data;
      //   this.render();
      // });
    } else {
      this.data = constants.json;
      this.render();
    }

    // Setup & get FET value
    this.fetTracked = false;
    if (constants.fet && window.rma) {
      this.fet = typeof constants.fet == 'string' ? [window.rma.fet] : window.rma.fet;
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
      this.cte = cte;
    } else {
      this.cte = [];
    }

    if (constants.tags && window.rma) {
      this.tags = this.processTags(window.rma.tags);
    } else if (constants.tags) {
      this.tags = this.processTags(constants.tags);
    } else {
      this.tags = '';
    }

    this.id = this.generateUniqueId();
    this.tracked = [];
    this.trackedEngagementType = [];
    this.engagementTypeExclude = [];
    this.firstEngagementTracked = false;
    this.content = document.getElementById('rma-widget');
    this.path = typeof window.rma !== 'undefined' ? window.rma.customize.src : '';
    for (var i = 0; i < this.custTracker.length; i++) {
      if (this.custTracker[i].indexOf('{2}') !== -1) {
        this.custTracker[i] = this.custTracker[i].replace('{2}', '{{type}}');
      }
    }
  }

  generateUniqueId() {
    return +new Date();
  }

  processTags(tags) {
    let resultTags = '';
    for (var tag in tags) {
      if (tags.hasOwnProperty(tag)) {
        resultTags += '&' + tag + '=' + tags[obj];
      }
    }
    return resultTags;
  }

  linkOpener(url) {
    if (typeof url !== 'undefined' && url !== '') {
      if (typeof this.ct !== 'undefined' && this.ct !== '') {
        this.url = url = this.ct + encodeURIComponent(url);
      }

      if (typeof mraid !== 'undefined') {
        mraid.open(url);
      } else {
        window.open(url);
      }

      if (typeof this.cte !== 'undefined' && this.cte !== '') {
        this.imageTracker(this.cte);
      }
    }
  }

  tracker(tt, type, name, value) {
    name = name || type;

    if (tt === 'E' && !this.fetTracked) {
      for (let i = 0; i < this.fet.length; i++) {
        let t = document.createElement('img');
        t.src = this.fet[i];

        t.style.display = 'none';
        this.body.appendChild(t);
      }
      this.fetTracked = true;
    }

    if (typeof this.custTracker !== 'undefined' && this.custTracker !== '' && this.tracked.indexOf(name) === -1) {
      for (let i = 0; i < this.custTracker.length; i++) {
        let img = document.createElement('img');

        if (typeof value === 'undefined') {
          value = '';
        }

        let src = this.custTracker[i].replace('{{rmatype}}', type);
        src = src.replace('{{rmavalue}}', value);

        if (this.trackedEngagementType.indexOf(tt) !== -1 || this.engagementTypeExclude.indexOf(tt) !== -1) {
          src = src.replace('tt={{rmatt}}', '');
        } else {
          src = src.replace('{{rmatt}}', tt);
          this.trackedEngagementType.push(tt);
        }

        if (!this.firstEngagementTracked && tt === 'E') {
          src = src + '&ty=E';
          this.firstEngagementTracked = true;
        }

        img.src = src + this.tags + '&' + this.id;

        img.style.display = 'none';
        this.body.appendChild(img);

        this.tracked.push(name);
      }
    }
  }

  imageTracker(url) {
    for (let i = 0; i < url.length; i++) {
      let t = document.createElement('img');
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
        }
      } catch (e) {
        reject(e);
      }
    });
  }

  loadCSS(url) {
    return new Promise((resolve, reject) => {
      try {
        const link = document.createElement('link');
        link.href = url;
        link.setAttribute('type', 'text/css');
        link.setAttribute('rel', 'stylesheet');
        this.head.appendChild(link);
        resolve(true);
      } catch (e) {
        reject(e);
      }
    });
  }
}
