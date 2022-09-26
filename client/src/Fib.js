import React, { Component } from 'react';
import axios from 'axios';

class Fib extends Component {
    state = {
        seenIndexes: [],
        values: {},
        index: '',
    };

    componentDidMount() {
        this.fetchValues();
        this.fetchIndices();
    }

    // 3. Fetch datas
    async fetchValues() {
        console.log("fetching values from redis");

        try {
            const values = await axios.get('/api/values/current');
            this.setState({ values: values.data });
        } catch (err) {
            console.log("fetch values err", err);
        }
    }

    async fetchIndices() {
        console.log("fetching values from PostGres");
        try {
            const seenIndexes = await axios.get('/api/values/all');
            this.setState({
                seenIndexes: seenIndexes.data,
            });
        } catch(err) {
            console.log("submit values err", err);
        }
    }



    // 4. Handler
    handleSubmit = async (event) => {
        event.preventDefault();

        try {
            // - post new index to calc. fibonacci
            const res = await axios.post('/api/values', {
                index: this.state.index,
            });

            // - save this index
            this.setState({ index: '' });
            console.log("finish submit", res);
        } catch (err) {
            console.log("submit values err", err);
        }
    };

    // 5. create JSX
    renderSeenIndexes() {
        return this.state.seenIndexes.map(({ number }) => number).join(', ');
    }

    renderValues() {
        const entries = [];

        for (let key in this.state.values) {
            entries.push(
                <div key={key}>
                    For index {key} I calculated {this.state.values[key]}
                </div>
            );
        }

        return entries;
    }

    render() {
        return (
            <div>
                <form onSubmit={this.handleSubmit}>
                    <label>Enter your index:</label>
                    <input
                        value={this.state.index}
                        onChange={(event) => this.setState({ index: event.target.value })}
                    />
                    <button>Submit</button>
                </form>

                <h3>Indexes I have seen:</h3>
                {this.renderSeenIndexes()}

                <h3>Calculated Values:</h3>
                {this.renderValues()}
            </div>
        );
    }
}

export default Fib;