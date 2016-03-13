import React, {Component} from 'react';
import ReactDOM from 'react-dom';
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

class App extends Component {
    constructor(props) {
        super(props);
        let labels = [];
        props.data.map((news) => {
            news.labels.map(label => {
                labels.indexOf(label) === -1 ? labels.push(label) : '';
            });
        });
        this.state = {
            news: props.data,
            labels: labels,
            activeLabels: [],
            visibleLabels: labels,
            sortFlag: true
        };
    }
    // обработчик клика на label
    // если есть активные лейблы показывать новости с ними
    // иначе показывать все новости
    handleLabel(label) {
        let {activeLabels, visibleLabels} = this.state;
        if(activeLabels.indexOf(label) === -1) activeLabels.push(label);
        else activeLabels.splice(activeLabels.indexOf(label), 1);
        if (activeLabels.length) visibleLabels = activeLabels;
        else visibleLabels = this.state.labels;
        this.setState({
            activeLabels: activeLabels,
            visibleLabels: visibleLabels
        });
    }
    // переключение сортировки по дате
    handleSort() {
        this.setState({sortFlag: !this.state.sortFlag});
    }
    // фильтрация новостей
    filterNews(arrNews) {
        return arrNews.filter(newsItem => this.state.activeLabels.every(labelElm => 
            newsItem.labels.includes(labelElm))).sort((a, b) => 
            {return this.state.sortFlag ? Date.parse(a.date) < Date.parse(b.date) : Date.parse(a.date) > Date.parse(b.date)});
    }
    render() {
        const visibleNews = this.filterNews.call(this, this.state.news);
        let dateClassName = cx({
            dateSort: true,
            desc: this.state.sortFlag
        });
        return (<div className={styles.container}>
            <div className={styles.topBar}>
                <div onClick={this.handleSort.bind(this)} className={dateClassName}><span>Date</span></div>
                <ul className={styles.labelsList}>
                    {this.state.labels.map((label, i) => <li className={this.state.activeLabels.indexOf(label) !== -1 ? styles.active : ''} key={i} onClick={this.handleLabel.bind(this, label)}>{label}</li>)}
                </ul>
            </div>
            {visibleNews.map((news, i) => {
                return <div key={i} className={styles.news}>
                    <div className={styles.date}>{news.date.substr(8, 2)}/{news.date.substr(5, 2)}<span className={styles.year}>{news.date.substr(0, 4)}</span></div>
                    <div className={styles.newsContent}>
                        <h2>{news.title}</h2>
                        <p>{news.text}</p>
                    </div>
                </div>
            })}
        </div>)
    }
}

ReactDOM.render(
    <App data={someJson} />,
    document.getElementById('app')
);