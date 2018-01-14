const http = require('http');
const querystring = require('querystring');
const moment = require('moment');
const config = require('./config');

const defaultTags = ['theguardian/mainsection', 'tone/news'];

const partyTags = [
  { partyId: 'lab', tag: 'politics/labour' },
  { partyId: 'con', tag: 'politics/conservatives' },
  { partyId: 'ld', tag: 'politics/liberaldemocrats' },
  { partyId: 'ukip', tag: 'politics/ukip' },
  { partyId: 'grn', tag: 'politics/green-party' }
];

const buildTagQuery = partyId => {
  const partyTag = partyTags.find(tag => tag.partyId === partyId);
  const tags = partyTag ? [...defaultTags, partyTag.tag] : defaultTags;

  return tags.join(',');
};

module.exports.get = (options) => {
  const toDate = moment(options.until);
  const query = {
    'show-fields': 'thumbnail',
    'section': 'politics',
    tag: buildTagQuery(options.partyId),
    'api-key': config.guardianApiKey,
    'to-date': toDate.format('YYYY-MM-DD'),
    'from-date': toDate.subtract(7, 'days').format('YYYY-MM-DD'),
    'page-size': options.limit
  };

  const httpOptions = {
    host: 'content.guardianapis.com',
    path: `/search?${querystring.stringify(query)}`,
    method: 'GET'
  };

  return new Promise((resolve, reject) => {
    const req = http.request(httpOptions, res => {
      let data = '';

      res.on('data', chunk => {
        data += chunk;
      });

      res.on('end', () => {
        if (res.statusCode === 200) {
          resolve(JSON.parse(data).response.results);
        } else {
          reject(new Error(res.statusCode + ' response from guardian api'));
        }
      });
    });

    req.on('error', err => {
      reject(err);
    });

    req.end();
  });
};
