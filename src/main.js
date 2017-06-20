/* global window */

import Mads from './scripts/mads';

class AdUnit extends Mads {
  constructor() {
    super();

    this.loadJS('https://code.jquery.com/jquery-1.11.3.min.js').then(() => {
      console.log(window.jQuery);
      console.log(typeof window.jQuery !== 'undefined');
    });

    this.loadCSS('https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap.min.css');
  }

  render() {
    console.log(this.data);
    this.content.innerHTML = `
      <div class="container" id="container">
        <div class="jumbotron">
          <h1>${this.data.title}</h1>
          <p>${this.data.sample}</p>
          <p><a class="btn btn-primary btn-lg button" href="#">Learn More</a></p>
        </div>
      </div>
    `;

    this.custTracker = ['http://www.tracker2.com?type={{rmatype}}&tt={{rmatt}}', 'http://www.tracker.com?type={{rmatype}}'];

    this.tracker('CTR', 'test');

    this.linkOpener('http://www.google.com');
  }

  style() {
    const elems = this.elems;
    console.log(elems);
    return `
      body {
        background: purple;
      }
    `;
  }

  events() {
    console.log(this.elems);
    console.log('events called');
  }
}

window.ad = new AdUnit();
