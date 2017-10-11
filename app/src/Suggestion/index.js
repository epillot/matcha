import React, { Component } from 'react';
import secureRequest from '../secureRequest';
import CircularProgress from 'material-ui/CircularProgress';
import ProfilePreview from './ProfilePreview/';
import { Toolbar, ToolbarGroup, ToolbarTitle, ToolbarSeparator } from 'material-ui/Toolbar';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import Paper from 'material-ui/Paper';
import SearchIcon from 'material-ui/svg-icons/action/search';
import IconButton from 'material-ui/IconButton';
import Filter from '../Filter/';
import ShowIcon from 'material-ui/svg-icons/navigation/arrow-drop-up';
import PrevIcon from 'material-ui/svg-icons/navigation/arrow-back';
import NextIcon from 'material-ui/svg-icons/navigation/arrow-forward';

const nbPerPage = 3;

const styles = {
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    overflowY: 'auto',
    height: '78vh',
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
      end: false,
      selected: [],
      tags: null,
    };
    this.mounted = true;
    this.curPage = 1;
    this.nbPage = 0;
    this.mode = 1;
    this.handleSort = this.handleSort.bind(this);
    this.applyFilter = this.applyFilter.bind(this);
    this.setStateIfMounted = this.setStateIfMounted.bind(this);
    this.skipPage = this.skipPage.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
    this.handleDel = this.handleDel.bind(this);
    this.openHandler = this.openHandler.bind(this);
    this.getUrl = this.getUrl.bind(this);
    this.startSuggestions = this.startSuggestions.bind(this);
  }

  setStateIfMounted(state, cb) {
    if (this.mounted) this.setState(state, cb);
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  componentDidMount() {
    // const config = {
    //   method: 'get',
    //   url: '/api/suggestion',
    // }
    // secureRequest(config, (err, response) => {
    //   setTimeout(() => {
    //     if (err) return this.props.onLogout();
    //     const { matchs } = response.data;
    //     if (this.mounted) {
    //       this.setState({matchs});
    //     }
    //   }, 500);
    // });
    this.getSuggestions(0);
  }

  async openHandler() {
    this.setStateIfMounted({open: true});
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
    if (n === 1 && this.curPage > this.nbPage) this.getSuggestions(1); //get next page from server
    else {
      this.setStateIfMounted(this.state); //re render with same state and curPage uptaded
    }
  }

  getUrl() {
    let url = '/api/suggestion?page=' + this.curPage + '&nb=' + nbPerPage;
    const { ageFilter, locFilter, popFilter, tagsFilter, sort, selected } = this.state;
    url += '&ageFilter=' + ageFilter;
    url += '&locFilter=' + locFilter;
    url += '&popFilter=' + popFilter;
    url += '&tagsFilter=' + tagsFilter;
    url += '&sort=' + sort;
    selected.forEach((tag, i) => url += `&tag${i + 1}=${tag}`)
    return url;
  }

  startSuggestions() {
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
      console.log(nbPage);
      if (matchs.length) this.nbPage++;
      let end;
      if (matchs.length < nbPerPage) end = this.nbPage || 1;
      setTimeout(() => {
        this.setStateIfMounted(state => {
          let newMatchs;
          if (this.curPage === 1) newMatchs = matchs;
          else {
            newMatchs = state.matchs.slice();
            Array.prototype.push.apply(newMatchs, matchs);
          }
          return {matchs: newMatchs, loading: false, end};
        });
      }, 500);
    } catch(e) {
      if (e === 'Unauthorized') this.props.onAuthFailed();
      else {
        console.log(e);
        this.setStateIfMounted({matchs: null, loading: false, end: true});
      }
    }

  }

  getAge(birthday) {
    return new Date().getFullYear() - new Date(birthday).getFullYear();
  }

  handleSort(e, i, value) {
    this.curPage = 1;
    this.setState(state => {
      const matchs = state.matchs.slice();
      switch (value) {
        case 1:
          matchs.sort((m1, m2) => m1.distance - m2.distance);
          break;
        case 2:
          matchs.sort((m1, m2) => {
            let diff = this.getAge(m1.birthday) - this.getAge(m2.birthday);
            return diff ? diff : m1.distance - m2.distance;
          });
          break;
        case 3:
          matchs.sort((m1, m2) => {
            let diff = m2.popularity - m1.popularity;
            return diff ? diff : m1.distance - m2.distance;
          });
          break;
        case 4:
          matchs.sort((m1, m2) => {
            let diff = m2.communTags - m1.communTags;
            return diff ? diff : m1.distance - m2.distance;
          });
          break;
        default:
      }
      return {matchs, sort: value}
    });
  }

  getDistanceLimit(filter) {
    if (filter === 0) return null;
    if (filter === 1) return 20000;
    if (filter === 2) return 50000;
    if (filter === 3) return 200000;
  }

  getAgeLimit(filter) {
    if (filter === 0) return null;
    if (filter === 1) return [18, 25];
    if (filter === 2) return [26, 35];
    if (filter === 3) return [36, 50];
    if (filter === 4) return [51, 70];
    if (filter === 5) return [71, 100];
  }

  getPopLimit(filter) {
    if (filter === 0) return null;
    if (filter === 1) return 1;
    if (filter === 2) return 10;
    if (filter === 3) return 100;
    if (filter === 4) return 500;
  }

  applyFilter() {
    const { matchs, ageFilter, locFilter, popFilter, tagsFilter } = this.state;
    if (matchs === null) return null;
    const start = (this.curPage - 1) * nbPerPage;
    let result = matchs.slice(start, start + nbPerPage);
    // const distanceLimit = this.getDistanceLimit(locFilter);
    // if (distanceLimit) result = result.filter(match => match.distance < distanceLimit);
    // const ageLimit = this.getAgeLimit(ageFilter);
    // if (ageLimit) {
    //   const [ ageMin, ageMax ] = ageLimit;
    //   result = result.filter(match => {
    //     const age = this.getAge(match.birthday);
    //     return age >= ageMin && age <= ageMax;
    //   });
    // }
    // const popLimit = this.getPopLimit(popFilter);
    // if (popLimit) result = result.filter(match => match.popularity >= popLimit);
    // const tagsLimit = tagsFilter;
    // if (tagsLimit) result = result.filter(match => match.communTags >= tagsLimit);
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
    const { matchs, sort, ageFilter, locFilter, popFilter, tagsFilter, open, tags, loading, end, selected, loadingTags } = this.state;
    const matchsToDisplay = this.applyFilter();
    return (
      <Paper style={{width: '90%', minWidth: '720px', margin: '30px auto'}}>
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
            <ToolbarTitle text={'Page ' + this.curPage}/>
            <IconButton
              onTouchTap={() => this.skipPage(-1)}
              disabled={this.curPage === 1 || loading}
            >
              <PrevIcon/>
            </IconButton>
            <IconButton
              onTouchTap={() => this.skipPage(1)}
              disabled={loading || (!!end && this.curPage >= end)}
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
    );
  }

}
