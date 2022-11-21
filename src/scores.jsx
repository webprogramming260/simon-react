import React from 'react';

export class Scores extends React.Component {
  render() {
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
          <tbody id='scores'></tbody>
        </table>
      </main>
    );
  }
}
