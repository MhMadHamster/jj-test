import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { createStore } from 'redux';
import classNames from 'classnames/bind';

import styles from './styles/styles.css';

let cx = classNames.bind(styles);

const someJson = [
    {
        "labels": ['javascript', 'css', 'html'],
        "title": "first news",
        "text": "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Praesentium possimus enim eius accusamus minus, sint ullam quam quisquam eveniet necessitatibus ad repellendus aspernatur consequuntur pariatur doloribus tenetur magni, impedit sit quas aut labore laboriosam fugit! Ullam inventore amet recusandae excepturi incidunt in sapiente dolores, minus delectus doloribus explicabo nostrum culpa!",
        "date": new Date(2016, 2, 10).toISOString()
    },
    {
        "labels": ['css', 'sass'],
        "title": "second news",
        "text": "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Enim temporibus magni vero corrupti id blanditiis eligendi est at accusantium doloremque rem numquam quaerat sequi dicta quis dolores amet mollitia fuga consequuntur, maxime necessitatibus, cum ducimus! Id, quo. Maxime fugit quasi aliquid nihil reprehenderit officiis recusandae debitis fugiat, repellat amet, culpa.",
        "date": new Date(2016, 2, 6).toISOString()
    },
    {
        "labels": ['javascript', 'babel', 'react'],
        "title": "third news",
        "text": "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Enim temporibus magni vero corrupti id blanditiis eligendi est at accusantium doloremque rem numquam quaerat sequi dicta quis dolores amet mollitia fuga consequuntur, maxime necessitatibus, cum ducimus! Id, quo. Maxime fugit quasi aliquid nihil reprehenderit officiis recusandae debitis fugiat, repellat amet, culpa.",
        "date": new Date(2016, 1, 6).toISOString()
    },

];

let arrLabels = [];
someJson.map(news => 
    news.labels.map(label =>
        arrLabels.indexOf(label) === -1 ? arrLabels.push(label) : ''
    )
);

const initialState = {
    news: someJson,
    labels: arrLabels,
    activeLabels: [],
    sortFlag: true
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case 'TOGGLE_LABEL':
            let activeLabels = state.activeLabels;
            if (activeLabels.includes(action.labelName)) {
                activeLabels.splice(activeLabels.indexOf(action.labelName), 1);
            } else {
                activeLabels.push(action.labelName);
            }
            return {
                ...state,
                activeLabels: activeLabels
            };
        case 'SORT_DATE':
            return {
                ...state,
                sortFlag: !state.sortFlag
            };
        default:
            return state;
    }
};

const store = createStore(reducer);

class App extends Component {
    constructor(props) {
        super(props);
    }
    // фильтрация новостей
    filterNews(arrNews) {
        if (!this.props.activeLabels.length) {
            return arrNews;
        }

        return arrNews.filter(newsItem => {
            return this.props.activeLabels.every(label => {
                return  newsItem.labels.includes(label);
            });
        }).sort((a, b) => {
            return this.props.sortFlag ? Date.parse(a.date) < Date.parse(b.date) : Date.parse(a.date) > Date.parse(b.date)
        });
    }
    render() {
        const visibleNews = this.filterNews.call(this, this.props.news);
        let dateClassName = cx({
            dateSort: true,
            desc: this.props.sortFlag
        });
        return (<div className={styles.container}>
            <div className={styles.topBar}>
                <div onClick={() => {
                    store.dispatch({
                        type: 'SORT_DATE'
                    })
                }} className={dateClassName}><span>Date</span></div>
                <ul className={styles.labelsList}>
                    {this.props.labels.map((label, i) => <li className={this.props.activeLabels.includes(label) ? styles.active : ''} key={i} onClick={() => {
                        store.dispatch({
                            type: 'TOGGLE_LABEL',
                            labelName: label
                        })
                    }}>{label}</li>)}
                </ul>
            </div>
            {visibleNews.map((news, i) => {
                return <div key={i} className={styles.news}>
                    <div className={styles.date}>{news.date.substr(8, 2)}/{news.date.substr(5, 2)}<span className={styles.year}>{news.date.substr(0, 4)}</span></div>
                    <div className={styles.newsContent}>
                        <h2>{news.title}</h2>
                        <p>{news.text}</p>
                        <div className={styles.newsLabels}>
                            {news.labels.map((label, i) => { return <span key={i}>{label}</span>})}
                        </div>
                    </div>
                </div>
            })}
        </div>)
    }
}

const render = () => {
    ReactDOM.render(
        <App 
            {...store.getState()}
         />,
        document.getElementById('app')
    );
}

store.subscribe(render);
render();
