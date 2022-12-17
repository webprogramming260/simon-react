import React from 'react';

export class Scores extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      scores: [],
    };

    // Get the latest high scores from the service
    fetch('/api/scores')
      .then((response) => response.json())
      .then((scores) => {
        this.setState({ scores: scores });
        // Save the scores in case we go offline in the future
        localStorage.setItem('scores', JSON.stringify(scores));
      })
      .catch(() => {
        // If there was an error then just use the last saved scores
        const scoresText = localStorage.getItem('scores');
        if (scoresText) {
          this.setState({ scores: JSON.parse(scoresText) });
        }
      });
  }

  render() {
    const scores = [];
    if (this.state.scores.length) {
      for (const [i, score] of this.state.scores.entries()) {
        scores.push(
          <tr key={i}>
            <td>{i}</td>
            <td>{score.name}</td>
            <td>{score.score}</td>
            <td>{score.date}</td>
          </tr>
        );
      }
    } else {
      scores.push(
        <tr key='0'>
          <td colSpan='4'>Be the first to score</td>
        </tr>
      );
    }

    return (
      <main className='container-fluid bg-secondary text-center'>
        <table className='table table-warning table-striped-columns'>
          <thead className='table-dark'>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Score</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody id='scores'>{scores}</tbody>
        </table>
      </main>
    );
  }
}
