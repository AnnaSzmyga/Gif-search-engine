const GIPHY_API_URL = "https://api.giphy.com";
const GIPHY_PUB_KEY = "Erk5MNWSzjRnB2r4jol85NgIeNRZyciS";

App = React.createClass({
    getInitialState() {
        return {
            loading: false,
            searchingText: '',
            gif: {},
            errorText: ''
        };
    },
    handleSearch: function(searchingText) {
        this.setState({
            loading: true
        });
        this.getGif(searchingText)
            .then(response => {
                var data = response.data;
                var gif = {
                    url: data.fixed_width_downsampled_url,
                    sourceUrl: data.url
                };
                this.setState({
                    loading: false,
                    gif: gif,
                    searchingText: searchingText
                });
            })
            .catch(error => {
                console.error(error);
                this.setState({
                    loading: false,
                    errorText: 'ERROR - something went wrong!'
                });
            });
    },
    getGif: function(searchingText) {
        return new Promise(
            function(resolve, reject) {
                var url = GIPHY_API_URL + '/v1/gifs/random?api_key=' + GIPHY_PUB_KEY + '&tag=' + searchingText;
                var xhr = new XMLHttpRequest();
                xhr.open('GET', url);
                xhr.onload = function() {
                    if (xhr.status === 200) {
                        var response = JSON.parse(xhr.responseText);
                        resolve(response);
                    } else {
                        reject(new Error(this.statusText));
                    }
                }
                xhr.onerror = function() {
                    reject(new Error(`XMLHttpRequest Error: ${this.statusText}`));
                }
                xhr.send();
            });
    },
    render: function() {
        var styles = {
            margin: '0 auto',
            textAlign: 'center',
            width: '90%'
        };
        return (
            <div style={styles}>
                <h1>Wyszukiwarka GIFow!</h1>
                <p>Znajdź gifa na <a href='http://giphy.com'>giphy</a>. Naciskaj enter, aby pobrać kolejne gify.</p>
                <Search onSearch={this.handleSearch}/>
                <p>{this.state.errorText}</p>
                <Gif
                    loading={this.state.loading}
                    url={this.state.gif.url}
                    sourceUrl={this.state.gif.sourceUrl}
                />
            </div>
        );
    }
});