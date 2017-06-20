/* global window */

import Mads from './scripts/mads';

class AdUnit extends Mads {
  constructor() {
    super();

    this.loadJS('https://code.jquery.com/jquery-1.11.3.min.js').then(() => {
      console.log(typeof window.jQuery !== 'undefined' ? 'jquery loaded' : 'jquery not loaded');
    });
  }

  render() {
    console.log('data', this.data);

    this.custTracker = ['http://www.tracker2.com?type={{rmatype}}&tt={{rmatt}}', 'http://www.tracker.com?type={{rmatype}}'];

    this.tracker('CTR', 'test');

    this.linkOpener('http://www.google.com');

    return `
      <div class="container" id="container">
        <div class="jumbotron">
          <h1>${this.data.title}</h1>
          <p>${this.data.sample}</p>
          <p><a class="btn btn-primary btn-lg button" href="#">Learn More</a></p>
        </div>
      </div>
    `;
  }

  style() {
    console.log('elements', this.elems);

    const links = ['https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap.min.css'];

    return [...links,
      `
      body {
        background: purple;
      }
      `];
  }

  events() {
    console.log('load events');
  }
}

window.ad = new AdUnit();
