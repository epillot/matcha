import React, { Component } from 'react';
import secureRequest from '../secureRequest';
import CircularProgress from 'material-ui/CircularProgress';
import ProfilePreview from './ProfilePreview/';
import { Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle } from 'material-ui/Toolbar';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import Paper from 'material-ui/Paper';

const styles = {
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    overflowY: 'auto',
    minHeight: '200px',
    maxHeight: '80vh',
  },
  container: {
    padding: '10px',
  }
};

export default class extends Component {

  constructor() {
    super();
    this.state = {
      matchs: null,
      sort: 1,
      ageFilter: 1,
      locFilter: 1,
      popFilter: 1,
      tagsFilter: 1,
    };
    this.mounted = true;
    this.handleSort = this.handleSort.bind(this);
    this.applyFilter = this.applyFilter.bind(this);
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  componentDidMount() {
    const config = {
      method: 'get',
      url: '/api/suggestion',
    }
    secureRequest(config, (err, response) => {
      setTimeout(() => {
        if (err) return this.props.onLogout();
        const { matchs } = response.data;
        if (this.mounted) {
          this.setState({matchs});
        }
      }, 500);
    });
  }

  getAge(birthday) {
    return new Date().getFullYear() - new Date(birthday).getFullYear();
  }

  handleSort(e, i, value) {
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
    if (filter === 1) return null;
    if (filter === 2) return 20000;
    if (filter === 3) return 50000;
    if (filter === 4) return 200000;
  }

  getAgeLimit(filter) {
    if (filter === 1) return null;
    if (filter === 2) return [18, 25];
    if (filter === 3) return [26, 35];
    if (filter === 4) return [36, 50];
    if (filter === 5) return [51, 70];
    if (filter === 6) return [71, 100];
  }

  getPopLimit(filter) {
    if (filter === 1) return null;
    if (filter === 2) return 1;
    if (filter === 3) return 10;
    if (filter === 4) return 100;
    if (filter === 5) return 500;
  }

  applyFilter() {
    const { matchs, ageFilter, locFilter, popFilter, tagsFilter } = this.state;
    let result = matchs.slice();
    const distanceLimit = this.getDistanceLimit(locFilter);
    if (distanceLimit) result = result.filter(match => match.distance < distanceLimit);
    const ageLimit = this.getAgeLimit(ageFilter);
    if (ageLimit) {
      const [ ageMin, ageMax ] = ageLimit;
      result = result.filter(match => {
        const age = this.getAge(match.birthday);
        return age >= ageMin && age <= ageMax;
      });
    }
    const popLimit = this.getPopLimit(popFilter);
    if (popLimit) result = result.filter(match => match.popularity >= popLimit);
    const tagsLimit = tagsFilter - 1;
    if (tagsLimit) result = result.filter(match => match.communTags >= tagsLimit);
    return result;
  }

  render() {
    const { matchs, sort, ageFilter, locFilter, popFilter, tagsFilter } = this.state;
    if (matchs === null) return <CircularProgress/>
    else {
      const matchsToDisplay = this.applyFilter();
      return (
        <Paper style={{width: '90%', margin: '30px auto'}}>
          <Toolbar>
            <ToolbarGroup firstChild={true}>
              <DropDownMenu value={sort} onChange={this.handleSort}>
                <MenuItem value={1} primaryText='Localisation' label='Sort by localisation'/>
                <MenuItem value={2} primaryText='Age' label='Sort by age'/>
                <MenuItem value={3} primaryText='Popularity' label='Sort by popularity'/>
                <MenuItem value={4} primaryText='Commun tags' label='Sort by commun tags'/>
              </DropDownMenu>
            </ToolbarGroup>
            <ToolbarGroup>
              <ToolbarTitle text='Filter'/>
              <DropDownMenu value={locFilter} onChange={(e, i, v) => this.setState({locFilter: v})}>
                <MenuItem value={1} primaryText='none' label='Distance: none'/>
                <MenuItem value={2} primaryText='< 20km' label='Distance: < 20km'/>
                <MenuItem value={3} primaryText='< 50km' label='Distance: < 50km'/>
                <MenuItem value={4} primaryText='< 200km' label='Distance: < 200km'/>
              </DropDownMenu>
              <ToolbarSeparator/>
              <DropDownMenu value={ageFilter} onChange={(e, i, v) => this.setState({ageFilter: v})}>
                <MenuItem value={1} primaryText='none' label='Age: none'/>
                <MenuItem value={2} primaryText='18-25' label='Age: 18-25'/>
                <MenuItem value={3} primaryText='26-35' label='Age: 26-35'/>
                <MenuItem value={4} primaryText='36-50' label='Age: 36-50'/>
                <MenuItem value={5} primaryText='51-70' label='Age: 51-70'/>
                <MenuItem value={6} primaryText='> 70' label='Age: > 70'/>
              </DropDownMenu>
              <ToolbarSeparator/>
              <DropDownMenu value={popFilter} onChange={(e, i, v) => this.setState({popFilter: v})}>
                <MenuItem value={1} primaryText='none' label='Popularity: none'/>
                <MenuItem value={2} primaryText='> 0' label='Popularity: > 0'/>
                <MenuItem value={3} primaryText='> 10' label='Popularity: > 10'/>
                <MenuItem value={4} primaryText='> 100' label='Popularity: > 100'/>
                <MenuItem value={5} primaryText='> 500' label='Popularity: > 500'/>
              </DropDownMenu>
              <ToolbarSeparator/>
              <DropDownMenu value={tagsFilter} onChange={(e, i, v) => this.setState({tagsFilter: v})}>
                <MenuItem value={1} primaryText='none' label='Commun tags: none'/>
                <MenuItem value={2} primaryText='1 or more' label='Commun tags: 1 or more'/>
                <MenuItem value={3} primaryText='2 or more' label='Commun tags: 2 or more'/>
                <MenuItem value={4} primaryText='3 or more' label='Commun tags: 3 or more'/>
                <MenuItem value={5} primaryText='4 or more' label='Commun tags: 4 or more'/>
                <MenuItem value={6} primaryText='5 or more' label='Commun tags: 5 or more'/>
                <MenuItem value={7} primaryText='6' label='Commun tags: 6'/>
              </DropDownMenu>
            </ToolbarGroup>
          </Toolbar>
          <div style={styles.root}>
            {matchsToDisplay.length ?
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
        </Paper>
      );
    }
  }

}
