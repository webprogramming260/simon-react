import React from 'react';
import './about.css';

// Demonstrates using React class style component
export class About extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      imageUrl: '',
      quote: 'loading...',
      quoteAuthor: 'unknown',
    };

    const random = Math.floor(Math.random() * 1000);
    fetch(`https://picsum.photos/v2/list?page=${random}&limit=1`)
      .then((response) => response.json())
      .then((data) => {
        const containerEl = document.querySelector('#picture');

        const width = containerEl.offsetWidth;
        const height = containerEl.offsetHeight;
        const imageUrl = `https://picsum.photos/id/${data[0].id}/${width}/${height}?grayscale`;
        this.setState({ imageUrl: imageUrl });
      })
      .catch();

    fetch('https://api.quotable.io/random')
      .then((response) => response.json())
      .then((data) => {
        this.setState({ quote: data.content, quoteAuthor: data.author });
      })
      .catch();
  }

  render() {
    let imgEl = '';

    if (this.state.imageUrl) {
      imgEl = <img src={this.state.imageUrl} alt='pretty' />;
    }

    return (
      <main className='container-fluid bg-secondary text-center'>
        <div>
          <div id='picture' className='picture-box'>
            {imgEl}
          </div>

          <p>
            Simon is a repetitive memory game where you follow the demonstrated color sequence until you make a mistake.
            The longer the sequence you repeat, the greater your score.
          </p>

          <p>
            The name Simon is a registered trademark of Milton-Bradley. Our use of the name and the game is for
            non-profit educational use only. No part of this code or program should be used outside of that definition.
          </p>

          <div className='quote-box bg-light text-dark'>
            <p className='quote'>{this.state.quote}</p>
            <p className='author'>{this.state.quoteAuthor}</p>
          </div>
        </div>
      </main>
    );
  }
}
