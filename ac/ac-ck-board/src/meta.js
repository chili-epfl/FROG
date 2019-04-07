// @flow

const learningItems = [
  {
    id: '1',
    liType: 'li-idea',
    payload: { title: 'Hi', content: 'Hello' },
    createdAt: '2018-05-10T12:02:07.525Z'
  },
  {
    id: '2',
    liType: 'li-idea',
    payload: { title: 'Uber', content: 'AirBnB for taxis' },
    createdAt: '2018-05-10T12:02:07.525Z'
  },
  {
    id: '3',
    liType: 'li-idea',
    payload: { title: 'Amazon Alexa', content: 'AskJeeves for speech' },
    createdAt: '2018-05-10T12:02:07.525Z'
  },
  {
    id: '4',
    liType: 'li-image',
    payload: {
      url: 'https://i.imgur.com/pfZAxeTb.jpg',
      thumburl: 'https://i.imgur.com/pfZAxeTb.jpg'
    },
    createdAt: '2018-05-10T12:05:08.700Z'
  }
];

const data = {
  '1': { id: '1', li: '1' },
  '2': { id: '2', li: '2' },
  '3': { id: '3', li: '3' },
  '4': { id: '4', li: '4' }
};

export const meta = {
  name: 'Common Knowledge board',
  mode: 'collab',
  shortDesc: '2D board for placing items',
  category: 'Core tools',
  supportsLearningItems: true,
  description:
    'All imported items are placed on a 2D space. Optionally, teacher can designate four named quadrants. Students can drag boxes to organize or group ideas. Incoming items have title and content.',
  exampleData: [
    {
      title: 'Board',
      config: { quadrants: false },
      data,
      learningItems
    },
    {
      title: 'Quadrants and boxes',
      config: {
        quadrants: true,
        quadrant1: 'Capitalism',
        quadrant2: 'Socialism',
        quadrant3: 'Modernism',
        quadrant4: 'Post-modernism'
      },
      data: {
        ...data,
        cjmj4j8es008ukwj05d861www: {
          id: 'cjmj4j8es008ukwj05d861www',
          li: {
            id: 'cjmj4j8ep0062kwj0tld7kswu',
            liDocument: {
              liType: 'li-hypothesis',
              createdAt: '2018-09-26T12:26:42.385Z',
              createdBy: 'op-hypothesis',
              payload: {
                rows: [
                  {
                    username: 'Alan Henness',
                    text:
                      'Comment submitted, awaiting approval:\n\nYou stated:\n\n"On the 16th June 2017, The Swiss Federal Government issued a press release  [13] ..."\n\nThe document you linked to is a press release by Dachverband Komplementärmedizin, the  Swiss Umbrella Association for Complementary Medicine, not the Swiss Federal Government.\n\n"The Swiss Federal Government acknowledges that complementary medicine meets insurance regulations (Swiss Federal Health Insurance Act 1996) when it comes to effectiveness, guaranteeing high quality and safety."\n\nThe Swiss government stated:\n\n"The remuneration for the services is provisional and limited in time, because it is not necessary to prove that the services of the four complementary medical disciplines are effective, expedient and economic. It has now been shown that this proof for the disciplines is not possible."\n\nhttps://www.admin.ch/gov/de/start/dokumentation/medienmitteilungen.msg-id-61140.html (translation from German to English by Google)',
                    date: 'Thu Aug 09 2018',
                    quotation:
                      '2. Complementary Medicine (including Homeopathy) in Switzerland:\nComplementary medicine in Switzerland is now a mandatory health insurance service: The Swiss Federal Government acknowledges that complementary medicine meets insurance regulations (Swiss Federal Health Insurance Act 1996) when it comes to effectiveness, guaranteeing high quality and safety.\nOn the 16th June 2017, The Swiss Federal Government issued a press release [13] announcing that specific medical services using complementary medicine are to be covered by mandatory health insurance (basic insurance) as of 1st August 2017. The following disciplines of complementary medicine will be fully covered: Classical Homeopathy, Anthroposophical Medicine, Traditional Chinese Medicine and Herbal Medicine, provided they are practised by conventional medical practitioners who have an additional qualification in one of the four disciplines as recognised by the Swiss Medical Association. This implements one of the key demands of the Swiss constitutional referendum held on 17th May 2009.',
                    article:
                      'Positive Health Online | Article - The UK Natio...',
                    articleSite: 'www.positivehealth.com',
                    id: 'WvGbgptgEeiX8UcEPNLgjw',
                    updated: '2018-08-08T23:11:17.911170+00:00'
                  }
                ]
              }
            }
          }
        },
        cjmj4j8es008vkwj0fppeayx5: {
          id: 'cjmj4j8es008vkwj0fppeayx5',
          li: {
            id: 'cjmj4j8ep0063kwj07kte5sbp',
            liDocument: {
              liType: 'li-hypothesis',
              createdAt: '2018-09-26T12:26:42.385Z',
              createdBy: 'op-hypothesis',
              payload: {
                rows: [
                  {
                    username: 'Alan Henness',
                    text:
                      'This is incorrect.\n\nIt was not a Health Technology Assessment and this error by many homeopaths has been corrected by [Dr Felix Gurtner](https://smw.ch/article/doi/smw.2012.13723) of the Federal Office of Public Health FOPH, Health and Accident Insurance Directorate, Bern, Switzerland.',
                    date: 'Sun Jul 15 2018',
                    quotation: 'Health Technology Assessment',
                    article:
                      "Formal Complaint Against BC's Provincial Health...",
                    articleSite: 'www.drzimmermann.org',
                    id: 'i0f0NohOEeicS-9p3iOj4Q',
                    updated: '2018-07-15T16:45:55.818919+00:00'
                  }
                ]
              }
            }
          }
        },
        cjlhuby9z000k01ywgce8n7nd: {
          id: 'cjlhuby9z000k01ywgce8n7nd',
          li: {
            id: 'cjlhuby9y000501yw9dhrwelp',
            liDocument: {
              liType: 'li-twitter',
              createdAt: '2018-08-31T10:13:37.990Z',
              createdBy: 'op-twitter',
              payload: {
                created_at: 'Fri Aug 31 10:09:48 +0000 2018',
                id: 133,
                id_str: '1035469698685710336',
                full_text:
                  '@marcelsalathe @epfl_exts @crowd_ai @foodrepo_org @appliedmldays Congrats!! Keep up the great work 👍🏼🎂🍾',
                truncated: false,
                display_text_range: [65, 103],
                entities: {
                  hashtags: [],
                  symbols: [],
                  user_mentions: [
                    {
                      screen_name: 'marcelsalathe',
                      name: 'Marcel Salathe',
                      id: 14177696,
                      id_str: '14177696',
                      indices: [0, 14]
                    },
                    {
                      screen_name: 'epfl_exts',
                      name: 'EPFL Extension School',
                      id: 7475681626784,
                      id_str: '756475681626783744',
                      indices: [15, 25]
                    },
                    {
                      screen_name: 'crowd_ai',
                      name: 'crowdAI',
                      id: 3434234,
                      id_str: '706885331224813568',
                      indices: [26, 35]
                    },
                    {
                      screen_name: 'foodrepo_org',
                      name: 'Food Repo',
                      id: 93443,
                      id_str: '953975487700795392',
                      indices: [36, 49]
                    },
                    {
                      screen_name: 'appliedmldays',
                      name: 'Applied ML Days',
                      id: 73434,
                      id_str: '763052115392593920',
                      indices: [50, 64]
                    }
                  ],
                  urls: []
                },
                metadata: {
                  iso_language_code: 'en',
                  result_type: 'recent'
                },
                source:
                  '<a href="http://twitter.com/download/iphone" rel="nofollow">Twitter for iPhone</a>',
                in_reply_to_status_id: 111,
                in_reply_to_status_id_str: '1035452255682666497',
                in_reply_to_user_id: 14177696,
                in_reply_to_user_id_str: '14177696',
                in_reply_to_screen_name: 'marcelsalathe',
                user: {
                  id: 7,
                  id_str: '778923737852805121',
                  name: 'Raffaël Vonovier',
                  screen_name: 'r_vonovier',
                  location: '',
                  description:
                    'Private banker, former Swiss diplomat and humanitarian worker. Views are my own. RT does not mean endorsement.',
                  url: null,
                  entities: {
                    description: {
                      urls: []
                    }
                  },
                  protected: false,
                  followers_count: 158,
                  friends_count: 628,
                  listed_count: 0,
                  created_at: 'Thu Sep 22 11:47:45 +0000 2016',
                  favourites_count: 2781,
                  utc_offset: null,
                  time_zone: null,
                  geo_enabled: false,
                  verified: false,
                  statuses_count: 1539,
                  lang: 'fr',
                  contributors_enabled: false,
                  is_translator: false,
                  is_translation_enabled: false,
                  profile_background_color: 'F5F8FA',
                  profile_background_image_url: null,
                  profile_background_image_url_https: null,
                  profile_background_tile: false,
                  profile_image_url:
                    'http://pbs.twimg.com/profile_images/778926903973572608/B0gwXOLw_normal.jpg',
                  profile_image_url_https:
                    'https://pbs.twimg.com/profile_images/778926903973572608/B0gwXOLw_normal.jpg',
                  profile_banner_url:
                    'https://pbs.twimg.com/profile_banners/778923737852805121/1474546088',
                  profile_link_color: '1DA1F2',
                  profile_sidebar_border_color: 'C0DEED',
                  profile_sidebar_fill_color: 'DDEEF6',
                  profile_text_color: '333333',
                  profile_use_background_image: true,
                  has_extended_profile: false,
                  default_profile: true,
                  default_profile_image: false,
                  following: false,
                  follow_request_sent: false,
                  notifications: false,
                  translator_type: 'none'
                },
                geo: null,
                coordinates: null,
                place: null,
                contributors: null,
                is_quote_status: false,
                retweet_count: 0,
                favorite_count: 0,
                favorited: false,
                retweeted: false,
                lang: 'en'
              }
            }
          }
        }
      },
      learningItems
    },
    {
      title: 'Background image',
      config: {
        quadrants: false,
        image: true,
        imageurl: '/clientFiles/ac-ck-board/researchCycle.png'
      },
      data,
      learningItems
    }
  ]
};

export const config = {
  type: 'object',
  properties: {
    allowCreate: { title: 'Enable adding new Learning Items', type: 'boolean' },
    onlySpecificLI: {
      title: 'Only allow specific Learning Item Type',
      type: 'boolean'
    },
    liType: { title: 'Learning Item type', type: 'learningItemType' },
    studentEditOwn: {
      title: 'Only let students move their own items',
      type: 'boolean'
    },
    studentEditOthers: {
      title: "Only let students move other students' items",
      type: 'boolean'
    },
    showUsername: {
      title: 'Display student names when available',
      type: 'boolean'
    },
    image: {
      title: 'Display background image',
      type: 'boolean'
    },
    imageurl: {
      title: 'URL of background image',
      type: 'string'
    },
    quadrants: {
      title: 'Draw four quadrants, named as below',
      type: 'boolean'
    },
    quadrant1: {
      title: 'Quadrant 1 title',
      type: 'string'
    },
    quadrant2: {
      title: 'Quadrant 2 title',
      type: 'string'
    },
    quadrant3: {
      title: 'Quadrant 3 title',
      type: 'string'
    },
    quadrant4: {
      title: 'Quadrant 4 title',
      type: 'string'
    }
  }
};

export const configUI = {
  quadrant1: { conditional: 'quadrants' },
  quadrant2: { conditional: 'quadrants' },
  quadrant3: { conditional: 'quadrants' },
  quadrant4: { conditional: 'quadrants' },
  imageurl: { conditional: 'image' },
  image: { conditional: (formData: Object) => !formData.quadrants },
  quadrants: { conditional: (formData: Object) => !formData.image },
  onlySpecificLI: { conditional: 'allowCreate' },
  liType: {
    conditional: (formData: Object) =>
      formData.allowCreate && formData.onlySpecificLI
  },
  studentEditOwn: {
    conditional: (formData: Object) => !formData.studentEditOthers
  },
  studentEditOthers: {
    conditional: (formData: Object) => !formData.studentEditOwn
  }
};
