import React, { Component } from 'react';
import secureRequest from '../secureRequest';
import CircularProgress from 'material-ui/CircularProgress';
import ProfilePreview from './ProfilePreview/';
import { Toolbar, ToolbarGroup, ToolbarTitle } from 'material-ui/Toolbar';
import Paper from 'material-ui/Paper';
import IconButton from 'material-ui/IconButton';
import Filter from './Filter/';
import ShowIcon from 'material-ui/svg-icons/navigation/arrow-drop-up';
import PrevIcon from 'material-ui/svg-icons/navigation/arrow-back';
import NextIcon from 'material-ui/svg-icons/navigation/arrow-forward';

const nbPerPage = 8;

const styles = {
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    overflowY: 'auto',
    minHeight: '65vh',
  },
  container: {
    padding: '10px',
  },
  filter: {
    paddingRight: '0px',
    marginRight: '0px',
  }
};

export default class extends Component {

  constructor() {
    super();
    this.state = {
      matchs: [],
      sort: 0,
      ageFilter: 0,
      locFilter: 0,
      popFilter: 0,
      tagsFilter: 0,
      open: false,
      loading: true,
      selected: [],
      tags: null,
      nbPage: 1,
    };
    this.mounted = true;
    this.curPage = 1;
    this.nbPage = 0;
    this.mode = 1;
    this.setStateIfMounted = this.setStateIfMounted.bind(this);
    this.skipPage = this.skipPage.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
    this.handleDel = this.handleDel.bind(this);
    this.openHandler = this.openHandler.bind(this);
    this.getUrl = this.getUrl.bind(this);
    this.startSuggestions = this.startSuggestions.bind(this);
    this.getMatchsToDisplay = this.getMatchsToDisplay.bind(this);
  }

  setStateIfMounted(state, cb) {
    if (this.mounted) this.setState(state, cb);
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  componentDidMount() {
    this.getSuggestions();
  }

  async openHandler() {
    this.setStateIfMounted({open: true});
    if (this.state.tags !== null) return;
    const config = {
      method: 'get',
      url: '/api/alltags'
    }
    try {
      const { data } = await secureRequest(config);
      this.setStateIfMounted({tags: data})
    } catch(e) {
      if (e === 'Unauthorized') this.props.onAuthFailed();
      else console.log(e);
    }
  }

  skipPage(n) {
    this.curPage = this.curPage === 1 && n === -1 ? 1 : this.curPage + n;
    if (n === 1 && this.curPage > this.nbPage) this.getSuggestions(); //Page not loaded yet, get next page from server
    else {
      this.setStateIfMounted(this.state); //Page already loded, re render with same state and curPage uptaded
    }
  }

  getUrl() {
    let url = '/api/people?page=' + this.curPage + '&nb=' + nbPerPage + '&mode=' + this.mode;
    const { ageFilter, locFilter, popFilter, tagsFilter, sort, selected } = this.state;
    url += '&ageFilter=' + ageFilter;
    url += '&locFilter=' + locFilter;
    url += '&popFilter=' + popFilter;
    url += '&tagsFilter=' + tagsFilter;
    url += '&sort=' + sort;
    selected.forEach((tag, i) => url += `&tag${i + 1}=${tag}`)
    return url;
  }

  startSuggestions(mode) {
    this.mode = mode;
    this.curPage = 1;
    this.nbPage = 0;
    this.setStateIfMounted({open: false});
    this.getSuggestions();
  }

  async getSuggestions() {
    const url = this.getUrl();
    const config = {
      method: 'get',
      url,
    };
    this.setStateIfMounted({loading: true});
    try {
      const { data: { matchs, nbPage } } = await secureRequest(config);
      if (matchs.length) this.nbPage++;
      setTimeout(() => {
        this.setStateIfMounted(state => {
          let newMatchs;
          if (this.curPage === 1) newMatchs = matchs;
          else {
            newMatchs = state.matchs.slice();
            Array.prototype.push.apply(newMatchs, matchs);
          }
          return {matchs: newMatchs, loading: false, nbPage};
        });
      }, 500);
    } catch(e) {
      if (e === 'Unauthorized') this.props.onAuthFailed();
      else {
        console.log(e);
        this.setStateIfMounted({matchs: null, loading: false, nbPage: 1});
      }
    }

  }

  getAge(birthday) {
    return new Date().getFullYear() - new Date(birthday).getFullYear();
  }


  getMatchsToDisplay() {
    const { matchs } = this.state;
    if (matchs === null) return null;
    const start = (this.curPage - 1) * nbPerPage;
    let result = matchs.slice(start, start + nbPerPage);
    return result;
  }

  handleSelect(tag, index) {
    this.setState(state => {
      const selected = this.state.selected.slice();
      if (index !== -1 && selected.length < 3 && selected.indexOf(tag) === -1) {
        selected.push(tag);
      }
      return {selected};
    });
  }

  handleDel(tag) {
    this.setState(state => {
      const selected = this.state.selected.slice();
      selected.splice(selected.indexOf(tag), 1);
      return {selected};
    });
  }

  render() {
    const { sort, ageFilter, locFilter, popFilter, tagsFilter, open, tags, loading, selected, nbPage } = this.state;
    const matchsToDisplay = this.getMatchsToDisplay();
    return (
      <div>
      <div style={{height: '20px'}}>
      </div>
      <Paper style={{width: '90%', minWidth: '720px', margin: 'auto'}}>
        <Toolbar>
          <ToolbarGroup>
            <ToolbarTitle text='Options and Search'/>
            <IconButton
              style={{width: '50px', height: '50px', padding: '12,5px'}}
              iconStyle={{width: '30px', height: '30px'}}
              onTouchTap={this.openHandler}
            >
              <ShowIcon/>
            </IconButton>
          </ToolbarGroup>
          <ToolbarGroup>
            <ToolbarTitle text={'Page ' + this.curPage + '/' + nbPage}/>
            <IconButton
              onTouchTap={() => this.skipPage(-1)}
              disabled={this.curPage === 1 || loading}
            >
              <PrevIcon/>
            </IconButton>
            <IconButton
              onTouchTap={() => this.skipPage(1)}
              disabled={loading || (this.curPage >= nbPage)}
            >
              <NextIcon/>
            </IconButton>
          </ToolbarGroup>
        </Toolbar>
        <div style={styles.root}>
          { loading  ? <CircularProgress/> : matchsToDisplay === null ? <p>An error occured</p> :
            matchsToDisplay.length ?
            matchsToDisplay.map(match =>
              <div style={styles.container} key={match._id}>
                <ProfilePreview
                  onClick={() => this.props.history.push('/profile/' + match._id)}
                  profile={match}
                />
              </div>
            )
          : 'No results found'
        }
        </div>
        <Filter
          startSuggestions={this.startSuggestions}
          open={open}
          tags={tags}
          onClose={() => this.setState({open: false})}
          ageFilter={ageFilter}
          locFilter={locFilter}
          popFilter={popFilter}
          tagsFilter={tagsFilter}
          sort={sort}
          selected={selected}
          onSelect={this.handleSelect}
          onDel={this.handleDel}
          onCheck={(type, range) => this.setState( state => ({[type]: range === state[type] ? 0 : range}) )}
        />
      </Paper>
      </div>
    );
  }

}
