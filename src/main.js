import Mads from './scripts/mads';

class AdUnit extends Mads {
  constructor() {
    super();

    this.loadJS('https://code.jquery.com/jquery-1.11.3.min.js').then((e) => {
      console.log(window.jQuery);
      console.log(typeof window.jQuery != 'undefined');
    })

    this.loadCSS('https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap.min.css');
  }

  render() {
    console.log(this.data);
    this.content.innerHTML = `<div class="container">
      <div class="jumbotron">
        <h1>Hello, world!</h1>
        <p>...</p>
        <p><a class="btn btn-primary btn-lg button" href="#">Learn More</a></p>
      </div>
    </div>`

    this.custTracker = ['http://www.tracker2.com?type={{type}}&tt={{tt}}','http://www.tracker.com?type={{type}}']

    this.tracker('CTR', 'test');

    this.linkOpener('http://www.google.com');
  }

  events() {

  }
}

window.ad = new AdUnit();
