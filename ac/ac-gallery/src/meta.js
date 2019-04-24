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
  },
  {
    id: '5',
    liType: 'li-activity',
    payload: {
      acType: 'ac-gallery',
      activityData: {config: {}},
      rz: 'cjubre3ju0002n9sejo26vv0w/all',
      title: 'Twitter'
    }
  }
];

export const meta = {
  name: 'Gallery',
  type: 'react-component',
  shortDesc: 'Display learning items',
  description:
    'Display a list of learning items, possibly categorised, option to allow upload and voting',
  supportsLearningItems: true,
  category: 'Core tools',
  exampleData: [
    {
      title: 'Simple view',
      learningItems,
      config: {
        minVote: 1
      },
      data: {
        a1: { id: 'a1', li: '1' },
        a2: { id: 'a2', li: '2' },
        a3: { id: 'a3', li: '3' },
        a4: { id: 'a4', li: '4' },
        a5: { id: 'a5', li: '5' }
      }
    },
    {
      title: 'With categories',
      config: {
        guidelines: 'Look at categories of image'
      },
      learningItems,
      data: {
        a1: { id: 'a1', li: '1', categories: ['tree', 'house'] },
        a2: { id: 'a2', li: '2', category: 'tree' },
        a3: { id: 'a3', li: '3', category: 'house' },
        a4: { id: 'a4', li: '4', categories: ['sky', 'tree'] }
      }
    },
    {
      title: 'With votes',
      config: {
        guidelines: 'Votez pour les images les plus interessantes',
        canVote: true,
        minVote: 2
      },
      learningItems,
      data: {
        a1: { id: 'a1', li: '1' },
        a2: { id: 'a2', li: '2' },
        a3: { id: 'a3', li: '3' },
        a4: { id: 'a4', li: '4' },
        id1: {
          id: 'id1',
          li: {
            id: 'id2',
            liDocument: {
              liType: 'li-spreadsheet',
              payload: [
                [
                  { readOnly: true, value: '                ' },
                  { readOnly: true, value: 'A' },
                  { readOnly: true, value: 'B' },
                  { readOnly: true, value: 'C' },
                  { readOnly: true, value: 'D' }
                ],
                [
                  { readOnly: true, value: 1 },
                  {
                    value: 'democracy',
                    key: 'A1',
                    col: 1,
                    row: 1,
                    className: '',
                    expr: 'democracy'
                  },
                  { value: '', key: 'B1', col: 2, row: 1 },
                  { value: '', key: 'C1', col: 3, row: 1 },
                  { value: '', key: 'D1', col: 4, row: 1 }
                ],
                [
                  { readOnly: true, value: 2 },
                  {
                    value: 'is great',
                    key: 'A2',
                    col: 1,
                    row: 2,
                    className: '',
                    expr: 'is great'
                  },
                  { value: '', key: 'B2', col: 2, row: 2 },
                  { value: '', key: 'C2', col: 3, row: 2 },
                  { value: '', key: 'D2', col: 4, row: 2 }
                ],
                [
                  { readOnly: true, value: 3 },
                  { value: '', key: 'A3', col: 1, row: 3 },
                  { value: '', key: 'B3', col: 2, row: 3 },
                  { value: '', key: 'C3', col: 3, row: 3 },
                  { value: '', key: 'D3', col: 4, row: 3 }
                ],
                [
                  { readOnly: true, value: 4 },
                  { value: '', key: 'A4', col: 1, row: 4 },
                  { value: '', key: 'B4', col: 2, row: 4 },
                  { value: '', key: 'C4', col: 3, row: 4 },
                  { value: '', key: 'D4', col: 4, row: 4 }
                ]
              ],
              createdAt: '2018-10-04T08:10:30.224Z',
              draft: false
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
        },
        cjmu6v2jm0036b2iyelwm6mxk: {
          id: 'cjmu6v2jm0036b2iyelwm6mxk',
          li: {
            id: 'cjmu6v2jl0027b2iyighae2ws',
            liDocument: {
              liType: 'li-hypothesis',
              createdAt: '2018-10-04T06:17:21.825Z',
              createdBy: 'op-hypothesis',
              username: 'Westerdale',
              payload: {
                rows: [
                  {
                    username: 'Westerdale',
                    displayName: 'Westerdale',
                    text:
                      "This. We need to research and study successful social movements in order to enact the change needed - while focusing on increasing engagement and participation. It takes work, cooperation and support. I just read this article today, and it's been on my mind all day: https://www.washingtonpost.com/news/answer-sheet/wp/2017/10/19/educator-schools-shouldnt-merely-allow-students-to-protest-they-should-support-them/?utm_term=.56d5520ee3e4 ",
                    date: 'Fri Oct 20 2017',
                    quotation:
                      'social movements around the world can learn from each other',
                    article:
                      'How Young Activists Deploy Digital Tools for Social Change',
                    articleLink:
                      'https://hyp.is/YjwozrU1EeeWBGPzfOTWgA/educatorinnovator.org/how-young-activists-deploy-digital-tools-for-social-change/',
                    id: 'YjwozrU1EeeWBGPzfOTWgA',
                    updated: '2017-10-20T01:24:14.286980+00:00',
                    timestampLink:
                      'https://hypothes.is/a/YjwozrU1EeeWBGPzfOTWgA'
                  },
                  {
                    username: 'onewheeljoe',
                    displayName: 'onewheeljoe',
                    text:
                      "I agree that this article would make for another great discussion. I'm interested in discussing this f2f with you, Westerdale, and interested colleagues. ",
                    date: 'Sat Nov 04 2017',
                    article: false,
                    articleLink:
                      'https://hyp.is/YjwozrU1EeeWBGPzfOTWgA/educatorinnovator.org/how-young-activists-deploy-digital-tools-for-social-change/',
                    lastRef: 'YjwozrU1EeeWBGPzfOTWgA',
                    id: '6I2x5sFpEeeuLMvkiVCbRw',
                    updated: '2017-11-04T14:10:27.530279+00:00',
                    timestampLink:
                      'https://hypothes.is/a/6I2x5sFpEeeuLMvkiVCbRw'
                  },
                  {
                    username: 'remikalir',
                    displayName: 'remikalir',
                    text:
                      'This is a great resource, thanks for sharing! Is this something we might also collaboratively read and annotate as part of the Marginal Syllabus? If you or others are interested, we can annotate and tag with "marginalsyllabus" and the article will be added as a complementary text to this year\'s syllabus.',
                    date: 'Fri Oct 20 2017',
                    article: false,
                    articleLink:
                      'https://hyp.is/YjwozrU1EeeWBGPzfOTWgA/educatorinnovator.org/how-young-activists-deploy-digital-tools-for-social-change/',
                    lastRef: 'YjwozrU1EeeWBGPzfOTWgA',
                    id: 'lq7eaLWTEeeL8VNybn_KbA',
                    updated: '2017-10-20T12:38:34.872939+00:00',
                    timestampLink:
                      'https://hypothes.is/a/lq7eaLWTEeeL8VNybn_KbA'
                  }
                ]
              }
            }
          }
        },
        cjmu6v2jm0037b2iy87b3q7to: {
          id: 'cjmu6v2jm0037b2iy87b3q7to',
          li: {
            id: 'cjmu6v2jl0028b2iyk8sb0zln',
            liDocument: {
              liType: 'li-hypothesis',
              createdAt: '2018-10-04T06:17:21.825Z',
              createdBy: 'op-hypothesis',
              username: 'Westerdale',
              payload: {
                rows: [
                  {
                    username: 'Westerdale',
                    displayName: 'Westerdale',
                    text:
                      "I know I have addressed with others my skepticism of digital revolutions. Using the internet to create thoughts of change is one thing, but successful social movements also mean sacrificing time and opportunity, which I'm not sure all are ready to do. Albeit, we have seen an increase of marches and demonstrations in the past year and a half, which I didn't think would happen.",
                    date: 'Fri Oct 20 2017',
                    quotation:
                      'skepticism, if not cynicism, about whether social media platforms enable users to challenge entrenched authority and change the world',
                    article:
                      'How Young Activists Deploy Digital Tools for Social Change',
                    articleLink:
                      'https://hyp.is/PelViLU0EeeFi19Wn-tkYw/educatorinnovator.org/how-young-activists-deploy-digital-tools-for-social-change/',
                    id: 'PelViLU0EeeFi19Wn-tkYw',
                    updated: '2017-10-20T01:16:03.837572+00:00',
                    timestampLink:
                      'https://hypothes.is/a/PelViLU0EeeFi19Wn-tkYw'
                  },
                  {
                    username: 'onewheeljoe',
                    displayName: 'onewheeljoe',
                    text:
                      "As a society we can overstate the role of communication technologies because of their novelty, to be sure. Still, I think the affordances of social media channels, though commercial and far from perfect, have changed civic the landscape of political activism. Gladwell's famous critique of Twitter and its overhyped role in social movements is a great example of how the role of social media in activism is still important to discuss.[ In an article for the New Yorker, he writes:](https://www.newyorker.com/magazine/2010/10/04/small-change-malcolm-gladwell)\n\n *“Social networks are particularly effective at increasing motivation,” Aaker and Smith write. But that’s not true. Social networks are effective at increasing participation—by lessening the level of motivation that participation requires. *\n\nI think his argument ignores the way social media might cast a broader net than traditional communication tools and it also might show would-be activists what the first steps of participation look like. ",
                    date: 'Sat Nov 04 2017',
                    article: false,
                    articleLink:
                      'https://hyp.is/PelViLU0EeeFi19Wn-tkYw/educatorinnovator.org/how-young-activists-deploy-digital-tools-for-social-change/',
                    lastRef: 'PelViLU0EeeFi19Wn-tkYw',
                    id: 'j0RuLMFpEeeOuAeyUoTCTA',
                    updated: '2017-11-04T14:07:57.681916+00:00',
                    timestampLink:
                      'https://hypothes.is/a/j0RuLMFpEeeOuAeyUoTCTA'
                  }
                ]
              }
            }
          }
        },
        cjmu6v2jm0038b2iycly1y9jb: {
          id: 'cjmu6v2jm0038b2iycly1y9jb',
          li: {
            id: 'cjmu6v2jl0029b2iy3ecj2fl8',
            liDocument: {
              liType: 'li-hypothesis',
              createdAt: '2018-10-04T06:17:21.825Z',
              createdBy: 'op-hypothesis',
              username: 'Westerdale',
              payload: {
                rows: [
                  {
                    username: 'Westerdale',
                    displayName: 'Westerdale',
                    text:
                      'And I think we need to better incorporate technology so that students can be even more engaged in civics, especially in these times.\n',
                    date: 'Fri Oct 20 2017',
                    quotation:
                      'We are finding young people constructing new forms of the civic imagination, using the resources of popular culture to help them articulate what a better future might look like.',
                    article:
                      'How Young Activists Deploy Digital Tools for Social Change',
                    articleLink:
                      'https://hyp.is/4jRuJrUzEeeysk-Wu1G80g/educatorinnovator.org/how-young-activists-deploy-digital-tools-for-social-change/',
                    id: '4jRuJrUzEeeysk-Wu1G80g',
                    updated: '2017-10-20T01:13:29.956273+00:00',
                    timestampLink:
                      'https://hypothes.is/a/4jRuJrUzEeeysk-Wu1G80g'
                  },
                  {
                    username: 'remikalir',
                    displayName: 'remikalir',
                    text:
                      'Indeed, there is some very promising work happening around civic engagement and new media. Next month, [Writing Our Civic Futures](https://docs.google.com/document/d/1OPjztRuEGA3pI2v3mhAOB9_Q9OyDs4CJtwetzVkyXaI/edit?usp=sharing) will engage with authors Nicole Mirra and Antero Garcia whose research article about civic imagination and innovation includes a specific focus on youth technology use as a mediator of civic engagement.',
                    date: 'Fri Oct 20 2017',
                    article: false,
                    articleLink:
                      'https://hyp.is/4jRuJrUzEeeysk-Wu1G80g/educatorinnovator.org/how-young-activists-deploy-digital-tools-for-social-change/',
                    lastRef: '4jRuJrUzEeeysk-Wu1G80g',
                    id: 'L_rq9LWTEeezPSMTAVXJHA',
                    updated: '2017-10-20T12:35:42.734240+00:00',
                    timestampLink:
                      'https://hypothes.is/a/L_rq9LWTEeezPSMTAVXJHA'
                  }
                ]
              }
            }
          }
        },
        cjmu6v2jm0039b2iy6qhu84av: {
          id: 'cjmu6v2jm0039b2iy6qhu84av',
          li: {
            id: 'cjmu6v2jl002ab2iy0vd2ppid',
            liDocument: {
              liType: 'li-hypothesis',
              createdAt: '2018-10-04T06:17:21.825Z',
              createdBy: 'op-hypothesis',
              username: 'Westerdale',
              payload: {
                rows: [
                  {
                    username: 'Westerdale',
                    displayName: 'Westerdale',
                    text:
                      "I see this concept the most in my classroom in regard to students - if you're not prepared to see their point of view or give them a vehicle to address it, this is where learning can stop. ",
                    date: 'Fri Oct 20 2017',
                    quotation:
                      ' they are not heard because adult leaders are looking in the wrong places, do not understand their language, and are not prepared to hear what they have to say. ',
                    article:
                      'How Young Activists Deploy Digital Tools for Social Change',
                    articleLink:
                      'https://hyp.is/bX2opLUzEeez7ody4Fy-vg/educatorinnovator.org/how-young-activists-deploy-digital-tools-for-social-change/',
                    id: 'bX2opLUzEeez7ody4Fy-vg',
                    updated: '2017-10-20T01:10:14.200563+00:00',
                    timestampLink:
                      'https://hypothes.is/a/bX2opLUzEeez7ody4Fy-vg'
                  },
                  {
                    username: 'kantorj',
                    displayName: 'kantorj',
                    text:
                      'This reminds me of the necessary and critical work teachers educators must do when they work with pre and inservice teachers to continually challenge dominant narratives around what teaching can and should be.  Seems like adults not listening to students in authentic and meaningful ways is so thoroughly baked into our school systems and especially those that support non-dominant students. ',
                    date: 'Tue Oct 24 2017',
                    article: false,
                    articleLink:
                      'https://hyp.is/bX2opLUzEeez7ody4Fy-vg/educatorinnovator.org/how-young-activists-deploy-digital-tools-for-social-change/',
                    lastRef: 'zb0FerWSEeeIFacc85g33w',
                    id: 'TyvTlrjnEeehxyOSme8mIw',
                    updated: '2017-10-24T18:15:26.292644+00:00',
                    timestampLink:
                      'https://hypothes.is/a/TyvTlrjnEeehxyOSme8mIw'
                  },
                  {
                    username: 'remikalir',
                    displayName: 'remikalir',
                    text:
                      "I appreciate you sharing about your own students and teaching, and I imagine it's quite challenging to learn how to see from a student's point of view. How do educators become prepared to hear what youth have to say? How have you learned to do that so the learning doesn't stop?",
                    date: 'Fri Oct 20 2017',
                    article: false,
                    articleLink:
                      'https://hyp.is/bX2opLUzEeez7ody4Fy-vg/educatorinnovator.org/how-young-activists-deploy-digital-tools-for-social-change/',
                    lastRef: 'bX2opLUzEeez7ody4Fy-vg',
                    id: 'zb0FerWSEeeIFacc85g33w',
                    updated: '2017-10-20T12:32:57.907992+00:00',
                    timestampLink:
                      'https://hypothes.is/a/zb0FerWSEeeIFacc85g33w'
                  }
                ]
              }
            }
          }
        },
        cjmu6v2jm003ab2iy8y96s3ex: {
          id: 'cjmu6v2jm003ab2iy8y96s3ex',
          li: {
            id: 'cjmu6v2jl002bb2iyyjadoios',
            liDocument: {
              liType: 'li-hypothesis',
              createdAt: '2018-10-04T06:17:21.825Z',
              createdBy: 'op-hypothesis',
              username: 'tutormentor1',
              payload: {
                rows: [
                  {
                    username: 'tutormentor1',
                    displayName: 'tutormentor1',
                    text:
                      "![](https://4.bp.blogspot.com/-2Soo8Tp3AOc/V_vUgZ1gHqI/AAAAAAAAJ5w/BuSVNRIp2q8JgFEUpkISumyoXO6fxlp4wCLcB/s400/LearningPath-10-10-16.jpg)  I used this graphic in an [Oct. 2016 article](http://tutormentor.blogspot.com/2016/10/springsteen-vivaldi-coast-guard-avengers.html) where I pointed to articles I had read the previous few days, and tried to make sense of them.\n\nWe need to teach youth habits of reading and thinking about what they read, and connecting with others, like we're doing in this annotation, so that more of them bring this habit with them into adult years.",
                    date: 'Fri Oct 13 2017',
                    quotation: 'we can learn much',
                    article:
                      'How Young Activists Deploy Digital Tools for Social Change',
                    articleLink:
                      'https://hyp.is/eJtWvK-kEeeZskPL4Bnmxw/educatorinnovator.org/how-young-activists-deploy-digital-tools-for-social-change/',
                    id: 'eJtWvK-kEeeZskPL4Bnmxw',
                    updated: '2017-10-12T23:24:18.894461+00:00',
                    timestampLink:
                      'https://hypothes.is/a/eJtWvK-kEeeZskPL4Bnmxw'
                  }
                ]
              }
            }
          }
        },
        cjmu6v2jm003bb2iyeaq56vpk: {
          id: 'cjmu6v2jm003bb2iyeaq56vpk',
          li: {
            id: 'cjmu6v2jl002cb2iyii0jimbg',
            liDocument: {
              liType: 'li-hypothesis',
              createdAt: '2018-10-04T06:17:21.825Z',
              createdBy: 'op-hypothesis',
              username: 'tutormentor1',
              payload: {
                rows: [
                  {
                    username: 'tutormentor1',
                    displayName: 'tutormentor1',
                    text:
                      'It is already worth my time of coming to this article just to find and watch this video. ',
                    date: 'Fri Oct 13 2017',
                    quotation:
                      '22-year-old describes herself as “an American through and through” ',
                    article:
                      'How Young Activists Deploy Digital Tools for Social Change',
                    articleLink:
                      'https://hyp.is/og5qyq-aEeegnQMWs15FPQ/educatorinnovator.org/how-young-activists-deploy-digital-tools-for-social-change/',
                    id: 'og5qyq-aEeegnQMWs15FPQ',
                    updated: '2017-10-12T22:13:53.413093+00:00',
                    timestampLink:
                      'https://hypothes.is/a/og5qyq-aEeegnQMWs15FPQ'
                  },
                  {
                    username: 'remikalir',
                    displayName: 'remikalir',
                    text:
                      "So pleased to read this, and thanks for joining another Marginal Syllabus conversation! As you may know, we've organized most of this year's syllabus around the theme [Writing Our Civic Futures](https://docs.google.com/document/d/1OPjztRuEGA3pI2v3mhAOB9_Q9OyDs4CJtwetzVkyXaI/edit?usp=sharing). If you, colleagues, or others in your network are interested in joining these future conversations, we can help with planning, onboarding, etc. It's great to see you here in the margins!",
                    date: 'Fri Oct 20 2017',
                    article: false,
                    articleLink:
                      'https://hyp.is/og5qyq-aEeegnQMWs15FPQ/educatorinnovator.org/how-young-activists-deploy-digital-tools-for-social-change/',
                    lastRef: 'og5qyq-aEeegnQMWs15FPQ',
                    id: 'KNBlPLWUEee5CwO7msJF2Q',
                    updated: '2017-10-20T12:42:40.230730+00:00',
                    timestampLink:
                      'https://hypothes.is/a/KNBlPLWUEee5CwO7msJF2Q'
                  }
                ]
              }
            }
          }
        },
        cjmu6v2jm003cb2iy86lrca8i: {
          id: 'cjmu6v2jm003cb2iy86lrca8i',
          li: {
            id: 'cjmu6v2jl002db2iy7inr7t0h',
            liDocument: {
              liType: 'li-hypothesis',
              createdAt: '2018-10-04T06:17:21.825Z',
              createdBy: 'op-hypothesis',
              username: 'tayken',
              payload: {
                rows: [
                  {
                    username: 'tayken',
                    displayName: 'Taylor',
                    text:
                      "Comedy/sarcasm/satire is often viewed as a means of avoiding real issues, but I agree that these can be key societal preparatory tools when revolutionary change is needed. Looking forward to Yomna's work!",
                    date: 'Fri Oct 06 2017',
                    quotation:
                      'various ways internet comedy and music keep alive the prospects of change in her home country, Egypt, encouraging young people to remain skeptical of entrenched power and ready to mobilize for revolutionary change when the moment is right. ',
                    article:
                      'How Young Activists Deploy Digital Tools for Social Change',
                    articleLink:
                      'https://hyp.is/dr8JWqq5EeeWlEMa2lpGwA/educatorinnovator.org/how-young-activists-deploy-digital-tools-for-social-change/',
                    id: 'dr8JWqq5EeeWlEMa2lpGwA',
                    updated: '2017-10-06T17:12:58.753203+00:00',
                    timestampLink:
                      'https://hypothes.is/a/dr8JWqq5EeeWlEMa2lpGwA'
                  }
                ]
              }
            }
          }
        },
        cjmu6v2jm003db2iy39wzjehy: {
          id: 'cjmu6v2jm003db2iy39wzjehy',
          li: {
            id: 'cjmu6v2jl002eb2iyyqvju320',
            liDocument: {
              liType: 'li-hypothesis',
              createdAt: '2018-10-04T06:17:21.825Z',
              createdBy: 'op-hypothesis',
              username: 'amalthea13',
              payload: {
                rows: [
                  {
                    username: 'amalthea13',
                    displayName: 'La Dawna Minnis',
                    text: "let's start here",
                    date: 'Wed Oct 04 2017',
                    quotation:
                      'what motivates their engagement and participation',
                    article:
                      'How Young Activists Deploy Digital Tools for Social Change',
                    articleLink:
                      'https://hyp.is/GeEuyKkwEee7QLfkRxG2vg/educatorinnovator.org/how-young-activists-deploy-digital-tools-for-social-change/',
                    id: 'GeEuyKkwEee7QLfkRxG2vg',
                    updated: '2017-10-04T18:16:11.418237+00:00',
                    timestampLink:
                      'https://hypothes.is/a/GeEuyKkwEee7QLfkRxG2vg'
                  }
                ]
              }
            }
          }
        },
        cjmu6v2jm003eb2iyslub7bg4: {
          id: 'cjmu6v2jm003eb2iyslub7bg4',
          li: {
            id: 'cjmu6v2jl002fb2iy0gnun8z7',
            liDocument: {
              liType: 'li-hypothesis',
              createdAt: '2018-10-04T06:17:21.825Z',
              createdBy: 'op-hypothesis',
              username: 'amalthea13',
              payload: {
                rows: [
                  {
                    username: 'amalthea13',
                    displayName: 'La Dawna Minnis',
                    text:
                      'How do we let them know that their voices are needed and valued? ',
                    date: 'Wed Oct 04 2017',
                    quotation:
                      'help them articulate what a better future might look like',
                    article:
                      'How Young Activists Deploy Digital Tools for Social Change',
                    articleLink:
                      'https://hyp.is/9JrR8KkvEeege-u4998xqw/educatorinnovator.org/how-young-activists-deploy-digital-tools-for-social-change/',
                    id: '9JrR8KkvEeege-u4998xqw',
                    updated: '2017-10-04T18:15:08.825564+00:00',
                    timestampLink:
                      'https://hypothes.is/a/9JrR8KkvEeege-u4998xqw'
                  },
                  {
                    username: 'remikalir',
                    displayName: 'remikalir',
                    text:
                      'Perhaps by having more youth centered in spaces where adults discuss "what a better future might look like," whether that\'s an academic conference (like DML, and I do hope there are more youth present at next August\'s Connected Learning Summit) or even in these margins.',
                    date: 'Fri Oct 20 2017',
                    article: false,
                    articleLink:
                      'https://hyp.is/9JrR8KkvEeege-u4998xqw/educatorinnovator.org/how-young-activists-deploy-digital-tools-for-social-change/',
                    lastRef: '9JrR8KkvEeege-u4998xqw',
                    id: 'MMbGhLWXEeeL9d_syXiqDQ',
                    updated: '2017-10-20T13:04:21.980819+00:00',
                    timestampLink:
                      'https://hypothes.is/a/MMbGhLWXEeeL9d_syXiqDQ'
                  }
                ]
              }
            }
          }
        },
        cjmu6v2jm003fb2iyyihja02n: {
          id: 'cjmu6v2jm003fb2iyyihja02n',
          li: {
            id: 'cjmu6v2jl002gb2iyl2bc6bz8',
            liDocument: {
              liType: 'li-hypothesis',
              createdAt: '2018-10-04T06:17:21.825Z',
              createdBy: 'op-hypothesis',
              username: 'amalthea13',
              payload: {
                rows: [
                  {
                    username: 'amalthea13',
                    displayName: 'La Dawna Minnis',
                    text:
                      'For me this speaks to the importance of meeting youth where they are (in digital spaces as well as emotionally/intellectually) and having a good sense of youth culture. Staying current and connected is a big challenge for educators, and by incorporating spaces that are currently being used by youth into our curriculum we can meet younger generations where they are and "speak their language".',
                    date: 'Wed Oct 04 2017',
                    quotation: 'adult leaders are looking in the wrong places,',
                    article:
                      'How Young Activists Deploy Digital Tools for Social Change',
                    articleLink:
                      'https://hyp.is/mt9GoKkvEeed2rs8jvjusg/educatorinnovator.org/how-young-activists-deploy-digital-tools-for-social-change/',
                    id: 'mt9GoKkvEeed2rs8jvjusg',
                    updated: '2017-10-04T18:12:38.418193+00:00',
                    timestampLink:
                      'https://hypothes.is/a/mt9GoKkvEeed2rs8jvjusg'
                  }
                ]
              }
            }
          }
        },
        cjmu6v2jm003gb2iy70ztb3s3: {
          id: 'cjmu6v2jm003gb2iy70ztb3s3',
          li: {
            id: 'cjmu6v2jl002hb2iy0idf8od2',
            liDocument: {
              liType: 'li-hypothesis',
              createdAt: '2018-10-04T06:17:21.825Z',
              createdBy: 'op-hypothesis',
              username: 'andreaz',
              payload: {
                rows: [
                  {
                    username: 'andreaz',
                    displayName: 'andreaz',
                    text:
                      'How do we support learners who find themselves, and the narratives and assumptions about their lives, ascribed political meanings in this way?',
                    date: 'Tue Oct 03 2017',
                    quotation:
                      'They can choose to speak up or remain silent, but political meanings are going to be made of their lives either way',
                    article:
                      'How Young Activists Deploy Digital Tools for Social Change',
                    articleLink:
                      'https://hyp.is/NYSQUqhyEeelRntfBpMTKQ/educatorinnovator.org/how-young-activists-deploy-digital-tools-for-social-change/',
                    id: 'NYSQUqhyEeelRntfBpMTKQ',
                    updated: '2017-10-03T19:36:53.483971+00:00',
                    timestampLink:
                      'https://hypothes.is/a/NYSQUqhyEeelRntfBpMTKQ'
                  },
                  {
                    username: 'ccantrill',
                    displayName: 'ccantrill',
                    text:
                      'This is a challenging question and provocative phrase. Today is National Day on Writing and it makes me think about the role of writing, and composing in general, in surfacing what might otherwise stay hidden, not heard, etc.',
                    date: 'Fri Oct 20 2017',
                    article: false,
                    articleLink:
                      'https://hyp.is/NYSQUqhyEeelRntfBpMTKQ/educatorinnovator.org/how-young-activists-deploy-digital-tools-for-social-change/',
                    lastRef: 'g90mpLWUEee5C_-vTpVf9g',
                    id: 'kastorWuEeebeadwgvyfdg',
                    updated: '2017-10-20T15:51:43.053581+00:00',
                    timestampLink:
                      'https://hypothes.is/a/kastorWuEeebeadwgvyfdg'
                  },
                  {
                    username: 'remikalir',
                    displayName: 'remikalir',
                    text:
                      'This is a challenging question and I wonder how different "adult leaders" (as Henry describes them in the next paragraph) respond based upon varied positions - as a classroom teacher, as a facilitator of youth development, as a mentor... on whose terms is such political meaning ascribed and negotiated?',
                    date: 'Fri Oct 20 2017',
                    article: false,
                    articleLink:
                      'https://hyp.is/NYSQUqhyEeelRntfBpMTKQ/educatorinnovator.org/how-young-activists-deploy-digital-tools-for-social-change/',
                    lastRef: 'NYSQUqhyEeelRntfBpMTKQ',
                    id: 'g90mpLWUEee5C_-vTpVf9g',
                    updated: '2017-10-20T12:45:12.976572+00:00',
                    timestampLink:
                      'https://hypothes.is/a/g90mpLWUEee5C_-vTpVf9g'
                  },
                  {
                    username: 'dogtrax',
                    displayName: 'dogtrax',
                    text:
                      'Good question .. how do we even notice they need that support?',
                    date: 'Wed Oct 04 2017',
                    article: false,
                    articleLink:
                      'https://hyp.is/NYSQUqhyEeelRntfBpMTKQ/educatorinnovator.org/how-young-activists-deploy-digital-tools-for-social-change/',
                    lastRef: 'NYSQUqhyEeelRntfBpMTKQ',
                    id: '_48z6KjqEeeOa38qMaeBTw',
                    updated: '2017-10-04T10:01:32.102684+00:00',
                    timestampLink:
                      'https://hypothes.is/a/_48z6KjqEeeOa38qMaeBTw'
                  }
                ]
              }
            }
          }
        },
        cjmu6v2jm003hb2iyp8zzjv7f: {
          id: 'cjmu6v2jm003hb2iyp8zzjv7f',
          li: {
            id: 'cjmu6v2jl002ib2iymqs6z3av',
            liDocument: {
              liType: 'li-hypothesis',
              createdAt: '2018-10-04T06:17:21.825Z',
              createdBy: 'op-hypothesis',
              username: 'andreaz',
              payload: {
                rows: [
                  {
                    username: 'andreaz',
                    displayName: 'andreaz',
                    text:
                      'One thing I noticed is in the video is not only the powerful way she connects with her listeners by beginning with her own intimate discussion of faith, but the way she sets that next to the negative examples from social media. It is a powerful argument. It struck me when she even corrected her error in an edit as well regarding the inaccurate citation of a Trump tweet. So much going on here. ',
                    date: 'Tue Oct 03 2017',
                    quotation: 'Speaking directly to the camera',
                    article:
                      'How Young Activists Deploy Digital Tools for Social Change',
                    articleLink:
                      'https://hyp.is/As0f2qhyEeeJk2c9O96JOQ/educatorinnovator.org/how-young-activists-deploy-digital-tools-for-social-change/',
                    id: 'As0f2qhyEeeJk2c9O96JOQ',
                    updated: '2017-10-03T19:35:28.317749+00:00',
                    timestampLink:
                      'https://hypothes.is/a/As0f2qhyEeeJk2c9O96JOQ'
                  },
                  {
                    username: 'remikalir',
                    displayName: 'remikalir',
                    text:
                      "Indeed! As this month's conversation starts to wrap up, we're going to reach out to those featured in this blog post, as well as Henry, and hopefully we'll be able to add another rich layer to our collective thoughts.",
                    date: 'Wed Oct 25 2017',
                    article: false,
                    articleLink:
                      'https://hyp.is/As0f2qhyEeeJk2c9O96JOQ/educatorinnovator.org/how-young-activists-deploy-digital-tools-for-social-change/',
                    lastRef: 'MhYQ3rkNEeejcA-d3et4yg',
                    id: 'ogo0UrmiEeeOpQOFG8lzAw',
                    updated: '2017-10-25T16:36:21.200798+00:00',
                    timestampLink:
                      'https://hypothes.is/a/ogo0UrmiEeeOpQOFG8lzAw'
                  },
                  {
                    username: 'SusannahSimmons',
                    displayName: 'SusannahSimmons',
                    text:
                      "That's a fantastic idea! She could answer our questions directly.",
                    date: 'Wed Oct 25 2017',
                    article: false,
                    articleLink:
                      'https://hyp.is/As0f2qhyEeeJk2c9O96JOQ/educatorinnovator.org/how-young-activists-deploy-digital-tools-for-social-change/',
                    lastRef: 'xvQDdLjpEee0Hz-fAuUJQQ',
                    id: 'MhYQ3rkNEeejcA-d3et4yg',
                    updated: '2017-10-24T22:46:38.388895+00:00',
                    timestampLink:
                      'https://hypothes.is/a/MhYQ3rkNEeejcA-d3et4yg'
                  },
                  {
                    username: 'kantorj',
                    displayName: 'kantorj',
                    text:
                      'Agreed.  Wondering whether she was invited to participate in this annotation with us? ',
                    date: 'Tue Oct 24 2017',
                    article: false,
                    articleLink:
                      'https://hyp.is/As0f2qhyEeeJk2c9O96JOQ/educatorinnovator.org/how-young-activists-deploy-digital-tools-for-social-change/',
                    lastRef: 'u7fgqKntEeejuseKST_E3g',
                    id: 'xvQDdLjpEee0Hz-fAuUJQQ',
                    updated: '2017-10-24T18:33:06.191119+00:00',
                    timestampLink:
                      'https://hypothes.is/a/xvQDdLjpEee0Hz-fAuUJQQ'
                  },
                  {
                    username: 'ccantrill',
                    displayName: 'ccantrill',
                    text:
                      "I agree that part of the story is both really interesting and important pedagogically to consider. She's making a huge shift here.",
                    date: 'Fri Oct 20 2017',
                    article: false,
                    articleLink:
                      'https://hyp.is/As0f2qhyEeeJk2c9O96JOQ/educatorinnovator.org/how-young-activists-deploy-digital-tools-for-social-change/',
                    lastRef: 'u7fgqKntEeejuseKST_E3g',
                    id: '8iMpfrWtEeeDB6tjf-KI_Q',
                    updated: '2017-10-20T15:47:15.417042+00:00',
                    timestampLink:
                      'https://hypothes.is/a/8iMpfrWtEeeDB6tjf-KI_Q'
                  },
                  {
                    username: 'SusannahSimmons',
                    displayName: 'SusannahSimmons',
                    text:
                      'I too appreciate her authenticity in the video. I think it also took a great deal of courage for her move from a safe video space with loyal viewers into an unknown political space. I would love to learn more about her process and reflections on this endeavor. ',
                    date: 'Thu Oct 05 2017',
                    article: false,
                    articleLink:
                      'https://hyp.is/As0f2qhyEeeJk2c9O96JOQ/educatorinnovator.org/how-young-activists-deploy-digital-tools-for-social-change/',
                    lastRef: 'As0f2qhyEeeJk2c9O96JOQ',
                    id: 'u7fgqKntEeejuseKST_E3g',
                    updated: '2017-10-05T16:53:37.904408+00:00',
                    timestampLink:
                      'https://hypothes.is/a/u7fgqKntEeejuseKST_E3g'
                  }
                ]
              }
            }
          }
        },
        cjmu6v2jm003ib2iyajdkk4k3: {
          id: 'cjmu6v2jm003ib2iyajdkk4k3',
          li: {
            id: 'cjmu6v2jl002jb2iybtluqcj5',
            liDocument: {
              liType: 'li-hypothesis',
              createdAt: '2018-10-04T06:17:21.825Z',
              createdBy: 'op-hypothesis',
              username: 'ccantrill',
              payload: {
                rows: [
                  {
                    username: 'ccantrill',
                    displayName: 'ccantrill',
                    text:
                      'This feels critical to me and something that could be further explored here -- how Communities of Practice support leadership development and action (for youth as well as adults). I see this in my own work at the National Writing Project -- we work together as teachers and writers to develop our practice. And in the process become leaders who can act when/as needed.\n\nLave and Wenger are important resources in this part of the discussion: http://infed.org/mobi/jean-lave-etienne-wenger-and-communities-of-practice/',
                    date: 'Tue Oct 03 2017',
                    quotation:
                      'developed her voice by participating in a community of practice',
                    article:
                      'How Young Activists Deploy Digital Tools for Social Change',
                    articleLink:
                      'https://hyp.is/dAYGpqhMEee7nU9muIqhvA/educatorinnovator.org/how-young-activists-deploy-digital-tools-for-social-change/',
                    id: 'dAYGpqhMEee7nU9muIqhvA',
                    updated: '2017-10-03T15:07:05.828712+00:00',
                    timestampLink:
                      'https://hypothes.is/a/dAYGpqhMEee7nU9muIqhvA'
                  },
                  {
                    username: 'dogtrax',
                    displayName: 'dogtrax',
                    text:
                      'Good wikipedia piece -- link was bad but this works:\nhttps://en.wikipedia.org/wiki/Legitimate_peripheral_participation\n\nThat idea of mentorship might translate into the concept here of more peripheral voices lead to others noticing and saying, Hey, I can do that, too (if they have something to say). The insight that the work has be made visible to newcomers is important, too.\n\n> If newcomers can directly observe the practices of experts, they understand the broader context into which their own efforts fit. -- Wikipedia\n',
                    date: 'Wed Oct 04 2017',
                    article: false,
                    articleLink:
                      'https://hyp.is/dAYGpqhMEee7nU9muIqhvA/educatorinnovator.org/how-young-activists-deploy-digital-tools-for-social-change/',
                    lastRef: '_GlNnKh4EeeNPMuRQ7868g',
                    id: 'ehyQxKjrEeefttP7aGHTLQ',
                    updated: '2017-10-04T10:05:13.432774+00:00',
                    timestampLink:
                      'https://hypothes.is/a/ehyQxKjrEeefttP7aGHTLQ'
                  },
                  {
                    username: 'ccantrill',
                    displayName: 'ccantrill',
                    text:
                      'Legitimate peripheral participation is often cited in the case as a frame for connection and engagement in a CoP over time. Looking it up online, this led me to the notion of "duality" which is interesting (https://en.wikipedia.org/wiki/Legitimate_peripheral_participation).\n\nI think CLMOOC is a place where we start to learn a lot about designing for emergence as a community. Albeit not perfect either, the idea of "infrastructuring" in participatory design is a way we started to think about it ... how to participants in an event change that event through their participation.\n\nAnyway ... Love your image. Been in that exact situation before! haha :)',
                    date: 'Tue Oct 03 2017',
                    article: false,
                    articleLink:
                      'https://hyp.is/dAYGpqhMEee7nU9muIqhvA/educatorinnovator.org/how-young-activists-deploy-digital-tools-for-social-change/',
                    lastRef: 'I9a2RqhjEeep4i8ZotUagg',
                    id: '_GlNnKh4EeeNPMuRQ7868g',
                    updated: '2017-10-03T20:25:24.164326+00:00',
                    timestampLink:
                      'https://hypothes.is/a/_GlNnKh4EeeNPMuRQ7868g'
                  },
                  {
                    username: 'dogtrax',
                    displayName: 'dogtrax',
                    text:
                      'The tricky questions behind the impact of any Community of Practice (or any other variable term) are how those communities come together in the first place, who (or multiple who) keeps it together and guides it forward, and who is left out (and for what reason). Tech provides more inroads, for sure, and the potential for expanded audience. It still remains an imperfect system.\n![](https://i.imgur.com/uWZPb.jpg)',
                    date: 'Tue Oct 03 2017',
                    article: false,
                    articleLink:
                      'https://hyp.is/dAYGpqhMEee7nU9muIqhvA/educatorinnovator.org/how-young-activists-deploy-digital-tools-for-social-change/',
                    lastRef: 'dAYGpqhMEee7nU9muIqhvA',
                    id: 'I9a2RqhjEeep4i8ZotUagg',
                    updated: '2017-10-03T17:49:01.417734+00:00',
                    timestampLink:
                      'https://hypothes.is/a/I9a2RqhjEeep4i8ZotUagg'
                  }
                ]
              }
            }
          }
        },
        cjmu6v2jm003jb2iyvn4nq08f: {
          id: 'cjmu6v2jm003jb2iyvn4nq08f',
          li: {
            id: 'cjmu6v2jl002kb2iy20lv5btx',
            liDocument: {
              liType: 'li-hypothesis',
              createdAt: '2018-10-04T06:17:21.825Z',
              createdBy: 'op-hypothesis',
              username: 'BMBOD',
              payload: {
                rows: [
                  {
                    username: 'BMBOD',
                    displayName: 'BMBOD',
                    text:
                      'I wonder, must voice be used to change the hearts and minds of others? Is there not power and value in a voice for naming, articulating, and potentially affirming things for oneself? ',
                    date: 'Tue Oct 03 2017',
                    quotation:
                      'described voice as the process of giving an account of oneself, one’s experiences, one’s perspectives, for the purpose of changing the hearts and minds of others.',
                    article:
                      'How Young Activists Deploy Digital Tools for Social Change',
                    articleLink:
                      'https://hyp.is/savjTKhFEeegV1-dMwQ6ww/educatorinnovator.org/how-young-activists-deploy-digital-tools-for-social-change/',
                    id: 'savjTKhFEeegV1-dMwQ6ww',
                    updated: '2017-10-03T14:18:14.403139+00:00',
                    timestampLink:
                      'https://hypothes.is/a/savjTKhFEeegV1-dMwQ6ww'
                  },
                  {
                    username: 'remikalir',
                    displayName: 'remikalir',
                    text:
                      'And on a slightly more meta, though not entirely unrelated note, the public/private tensions associated with voice are quite present as we use open web annotation to collaboratively read and discuss this blog post. Which, for me, suggests a range of possibilities for open web annotation to operate as civic media...',
                    date: 'Fri Oct 20 2017',
                    article: false,
                    articleLink:
                      'https://hyp.is/savjTKhFEeegV1-dMwQ6ww/educatorinnovator.org/how-young-activists-deploy-digital-tools-for-social-change/',
                    lastRef: 'savjTKhFEeegV1-dMwQ6ww',
                    id: '_4oSsrWUEeetGJ-MoYxCWg',
                    updated: '2017-10-20T12:48:40.475077+00:00',
                    timestampLink:
                      'https://hypothes.is/a/_4oSsrWUEeetGJ-MoYxCWg'
                  },
                  {
                    username: 'tutormentor1',
                    displayName: 'tutormentor1',
                    text:
                      'In 2009 a class at DePaul University began a project with first year students, supported by my organization, the Tutor/Mentor Connection. This [blog article ](http://tutormentor.blogspot.com/2009/10/depaul-class-learns-about-chicago-with.html)describes the work students were expected to do, and  includes links to blog articles by students. \n\nThis project repeated the next year, but not after that. And, there were no "next step" classes that first year students might have taken during the next few years at DePaul, to build their depth of understanding, and to build their skills at communicating what they were learning, and what they wanted others to do.  \n\nI think students need to learn to use their voice, and they need to practice this over many years, to become skilled, and comfortable, in taking this role.',
                    date: 'Fri Oct 13 2017',
                    article: false,
                    articleLink:
                      'https://hyp.is/savjTKhFEeegV1-dMwQ6ww/educatorinnovator.org/how-young-activists-deploy-digital-tools-for-social-change/',
                    lastRef: 'gQkoHKhjEeef-TdQJsJeGw',
                    id: 'bRZaBK-eEee3Ras1ureOmw',
                    updated: '2017-10-12T22:41:02.779637+00:00',
                    timestampLink:
                      'https://hypothes.is/a/bRZaBK-eEee3Ras1ureOmw'
                  },
                  {
                    username: 'dogtrax',
                    displayName: 'dogtrax',
                    text:
                      'I suspect, both (articulate for yourself and for others). This brings up, for me, the power of writing, too, to articulate your beliefs as one develops their voice.\n![](https://az616578.vo.msecnd.net/files/2016/05/23/635996431884087159-1400546321_branding_voice.jpg)',
                    date: 'Tue Oct 03 2017',
                    article: false,
                    articleLink:
                      'https://hyp.is/savjTKhFEeegV1-dMwQ6ww/educatorinnovator.org/how-young-activists-deploy-digital-tools-for-social-change/',
                    lastRef: 'savjTKhFEeegV1-dMwQ6ww',
                    id: 'gQkoHKhjEeef-TdQJsJeGw',
                    updated: '2017-10-03T17:51:37.775766+00:00',
                    timestampLink:
                      'https://hypothes.is/a/gQkoHKhjEeef-TdQJsJeGw'
                  }
                ]
              }
            }
          }
        },
        cjmu6v2jm003kb2iyl2qzdp1i: {
          id: 'cjmu6v2jm003kb2iyl2qzdp1i',
          li: {
            id: 'cjmu6v2jl002lb2iyjaps8ap3',
            liDocument: {
              liType: 'li-hypothesis',
              createdAt: '2018-10-04T06:17:21.825Z',
              createdBy: 'op-hypothesis',
              username: 'actualham',
              payload: {
                rows: [
                  {
                    username: 'actualham',
                    displayName: 'Robin DeRosa',
                    text:
                      "I think Cathy N Davidson's new book on transforming the university puts this into a helpful historical context as far as the mechanics of education are concerned, and I'm taking some good, practical ideas away from her work about the challenges and possibilities that tech raises for teachers who aim to actively engage students in their own learning.",
                    date: 'Tue Oct 03 2017',
                    quotation:
                      'The internet may not have changed everything, but it has definitely changed many things about the way politics operates in the 21st century, and youth have been on the front lines of this process.',
                    article:
                      'How Young Activists Deploy Digital Tools for Social Change',
                    articleLink:
                      'https://hyp.is/QqThnqg0EeetPpe3eptzGw/educatorinnovator.org/how-young-activists-deploy-digital-tools-for-social-change/',
                    id: 'QqThnqg0EeetPpe3eptzGw',
                    updated: '2017-10-03T12:13:26.687798+00:00',
                    timestampLink:
                      'https://hypothes.is/a/QqThnqg0EeetPpe3eptzGw'
                  }
                ]
              }
            }
          }
        },
        cjmu6v2jm003lb2iys8yaf7j1: {
          id: 'cjmu6v2jm003lb2iys8yaf7j1',
          li: {
            id: 'cjmu6v2jl002mb2iymbf6hvms',
            liDocument: {
              liType: 'li-hypothesis',
              createdAt: '2018-10-04T06:17:21.825Z',
              createdBy: 'op-hypothesis',
              username: 'actualham',
              payload: {
                rows: [
                  {
                    username: 'actualham',
                    displayName: 'Robin DeRosa',
                    text:
                      'I have been thinking about this-- and wondering how I shape and predetermine how my students develop their voices on the web. Trying to strike the balance between educating about privacy and public work, helping with content development through critical questions, and backing off enough to let new paths emerge that I might not have led them to.',
                    date: 'Tue Oct 03 2017',
                    quotation: 'adult leaders are looking in the wrong places',
                    article:
                      'How Young Activists Deploy Digital Tools for Social Change',
                    articleLink:
                      'https://hyp.is/H7FKtqgzEeek8nP4MyC2vw/educatorinnovator.org/how-young-activists-deploy-digital-tools-for-social-change/',
                    id: 'H7FKtqgzEeek8nP4MyC2vw',
                    updated: '2017-10-03T12:05:18.476650+00:00',
                    timestampLink:
                      'https://hypothes.is/a/H7FKtqgzEeek8nP4MyC2vw'
                  },
                  {
                    username: 'tutormentor1',
                    displayName: 'tutormentor1',
                    text:
                      '![](http://3.bp.blogspot.com/-1jQfA3jXxZs/UvewnSExu_I/AAAAAAAAGFs/rxso_GvFCCs/s320/TeenSlain2-6-141.jpg)  This [blog article](http://tutormentor.blogspot.com/2014/02/following-bad-news-in-media-with-rest.html) shows a role students could learn to take, regardless of where they are in the world. \n\nI think Nabela Noor\'s video could have been even more powerful if she had ended with a call to action, such as "go here to learn more".\n',
                    date: 'Fri Oct 13 2017',
                    article: false,
                    articleLink:
                      'https://hyp.is/H7FKtqgzEeek8nP4MyC2vw/educatorinnovator.org/how-young-activists-deploy-digital-tools-for-social-change/',
                    lastRef: '4icOeqhjEee_emv5g75qWA',
                    id: '7aLv3q-eEee3KjvrSiBhBw',
                    updated: '2017-10-12T22:44:38.445815+00:00',
                    timestampLink:
                      'https://hypothes.is/a/7aLv3q-eEee3KjvrSiBhBw'
                  },
                  {
                    username: 'dogtrax',
                    displayName: 'dogtrax',
                    text: 'Finding the right balance .. always tricky.\n',
                    date: 'Tue Oct 03 2017',
                    article: false,
                    articleLink:
                      'https://hyp.is/H7FKtqgzEeek8nP4MyC2vw/educatorinnovator.org/how-young-activists-deploy-digital-tools-for-social-change/',
                    lastRef: 'H7FKtqgzEeek8nP4MyC2vw',
                    id: '4icOeqhjEee_emv5g75qWA',
                    updated: '2017-10-03T17:54:32.519967+00:00',
                    timestampLink:
                      'https://hypothes.is/a/4icOeqhjEee_emv5g75qWA'
                  },
                  {
                    username: 'BMBOD',
                    displayName: 'BMBOD',
                    text: '👍',
                    date: 'Tue Oct 03 2017',
                    article: false,
                    articleLink:
                      'https://hyp.is/H7FKtqgzEeek8nP4MyC2vw/educatorinnovator.org/how-young-activists-deploy-digital-tools-for-social-change/',
                    lastRef: 'H7FKtqgzEeek8nP4MyC2vw',
                    id: 'TJ9fRqhGEeewild6TPKNkA',
                    updated: '2017-10-03T14:22:34.449227+00:00',
                    timestampLink:
                      'https://hypothes.is/a/TJ9fRqhGEeewild6TPKNkA'
                  }
                ]
              }
            }
          }
        },
        cjmu6v2jm003mb2iyc5tr52v6: {
          id: 'cjmu6v2jm003mb2iyc5tr52v6',
          li: {
            id: 'cjmu6v2jl002nb2iytc8ewpls',
            liDocument: {
              liType: 'li-hypothesis',
              createdAt: '2018-10-04T06:17:21.825Z',
              createdBy: 'op-hypothesis',
              username: 'onewheeljoe',
              payload: {
                rows: [
                  {
                    username: 'onewheeljoe',
                    displayName: 'onewheeljoe',
                    text:
                      "This activism plays out in large part on commercial channels and it seems like the platform providers don't have to prove this at all. Instead, all they have to do is maintain their industry dominance and marginalized folks will have to compromise their data and privacy while playing by the rules of Silicon Valley. ",
                    date: 'Tue Oct 03 2017',
                    quotation:
                      '“As new citizen media from protests and conflicts is uploaded and shared across the web, emerging and existing platforms must prove they are committed to hosting valuable citizen-generated content with attention to its safekeeping and integrity, careful archiving of media in a way that is searchable and accessible, and no monetary cost to promote visibility.',
                    article:
                      'How Young Activists Deploy Digital Tools for Social Change',
                    articleLink:
                      'https://hyp.is/zslQNKfZEeekw2f_HOmaqg/educatorinnovator.org/how-young-activists-deploy-digital-tools-for-social-change/',
                    id: 'zslQNKfZEeekw2f_HOmaqg',
                    updated: '2017-10-03T01:25:57.606533+00:00',
                    timestampLink:
                      'https://hypothes.is/a/zslQNKfZEeekw2f_HOmaqg'
                  },
                  {
                    username: 'tutormentor1',
                    displayName: 'tutormentor1',
                    text:
                      'Take some time to read the [Cluetrain Manifesto](http://www.cluetrain.com/) from the late 1990s.  Some of the optimism from then may have waned as Facebook, Google and others are limiting who sees what is posted and how we connect. Yet the basic idea is that people will find ways to bypass these barriers and connect around issues that are important to them.\n\nWe need to inspire young people to invent this next form of connectivity.\n',
                    date: 'Fri Oct 13 2017',
                    article: false,
                    articleLink:
                      'https://hyp.is/zslQNKfZEeekw2f_HOmaqg/educatorinnovator.org/how-young-activists-deploy-digital-tools-for-social-change/',
                    lastRef: 'THMIwqglEeeC4DcxLWQwvQ',
                    id: '1qhTQq-iEeeaS09Whu6PWA',
                    updated: '2017-10-12T23:12:37.838805+00:00',
                    timestampLink:
                      'https://hypothes.is/a/1qhTQq-iEeeaS09Whu6PWA'
                  },
                  {
                    username: 'dogtrax',
                    displayName: 'dogtrax',
                    text:
                      'This runs counter to the landscape of the say, where profit rules much innovation, and investment demands a return -- often at the expense of our data and our privacy.',
                    date: 'Tue Oct 03 2017',
                    article: false,
                    articleLink:
                      'https://hyp.is/zslQNKfZEeekw2f_HOmaqg/educatorinnovator.org/how-young-activists-deploy-digital-tools-for-social-change/',
                    lastRef: 'zslQNKfZEeekw2f_HOmaqg',
                    id: 'THMIwqglEeeC4DcxLWQwvQ',
                    updated: '2017-10-03T10:26:20.717474+00:00',
                    timestampLink:
                      'https://hypothes.is/a/THMIwqglEeeC4DcxLWQwvQ'
                  }
                ]
              }
            }
          }
        },
        cjmu6v2jm003nb2iygt51fc6u: {
          id: 'cjmu6v2jm003nb2iygt51fc6u',
          li: {
            id: 'cjmu6v2jl002ob2iymp1o16rn',
            liDocument: {
              liType: 'li-hypothesis',
              createdAt: '2018-10-04T06:17:21.825Z',
              createdBy: 'op-hypothesis',
              username: 'onewheeljoe',
              payload: {
                rows: [
                  {
                    username: 'onewheeljoe',
                    displayName: 'onewheeljoe',
                    text:
                      "Our news cycles and the narratives we craft to fit inside the cycles demonstrate that we might not have the attention span to understand the continuing struggles and the slow ebb and flow of change. Power structures don't crumble under the weight of new media, rather they respond with counter measures. ",
                    date: 'Tue Oct 03 2017',
                    quotation:
                      'Our romanticization of these digital freedom fighters makes it harder for us to make sense of the conflicting reports we receive about the long-term impact of these social change movements.',
                    article:
                      'How Young Activists Deploy Digital Tools for Social Change',
                    articleLink:
                      'https://hyp.is/0tJfpqfXEeehVBMVEdFGpA/educatorinnovator.org/how-young-activists-deploy-digital-tools-for-social-change/',
                    id: '0tJfpqfXEeehVBMVEdFGpA',
                    updated: '2017-10-03T01:11:45.387511+00:00',
                    timestampLink:
                      'https://hypothes.is/a/0tJfpqfXEeehVBMVEdFGpA'
                  },
                  {
                    username: 'remikalir',
                    displayName: 'remikalir',
                    text:
                      'I\'m fondly recalling our recent conversations at OpenEd as we touched upon a few of these concerns and limitations. I\'m also reminded of [this blog post](http://jeremydean.org/blog/uncategorized/dont-press-that-button-on-technological-critiquism/) by Jeremy about what he terms "technological critiquism." In his post he suggests that critique of various edtech efforts, or teaching practices, or whatever happens to be in (educational) vogue (and perhaps for quite problematic reasons) can "become enamored and blinded by their own brand. Such criticism basically reads like the same dystopian science fiction novel written over and over again: what seemed like a good idea at the time is now destroying us; the robots have risen up."\n\nPart of what I think you\'re suggesting (???) is that we recognize our own complicity in particular problems, and that we might be more honest in sharing our struggles with uncritical evangelism. ',
                    date: 'Fri Oct 20 2017',
                    article: false,
                    articleLink:
                      'https://hyp.is/0tJfpqfXEeehVBMVEdFGpA/educatorinnovator.org/how-young-activists-deploy-digital-tools-for-social-change/',
                    lastRef: '9z8oDqgzEeeOc5_40RkXzA',
                    id: '9FBOoLWWEeeIBQ-LA-ZOEQ',
                    updated: '2017-10-20T13:02:40.638895+00:00',
                    timestampLink:
                      'https://hypothes.is/a/9FBOoLWWEeeIBQ-LA-ZOEQ'
                  },
                  {
                    username: 'actualham',
                    displayName: 'Robin DeRosa',
                    text:
                      "I've been thinking of parallels to this kind of uncritical evangelism. It seems (given my own US political context right now) especially crucial to build a liberatory movement that is self-critical about its own problems and limits. It seems part of the point of movements to empower student voices or democratize web spaces to complicate our understanding of power dynamics and interrogate the ways that our own platforms (for example) subvert our intentions. I think our work will be stronger, not weaker, if we aggressively and generously show the ways that we fail, reinscribe problems, or struggle within broken parameters. I've always loved and admired and valued that kind of honesty in colleagues who work on these ideas.",
                    date: 'Tue Oct 03 2017',
                    article: false,
                    articleLink:
                      'https://hyp.is/0tJfpqfXEeehVBMVEdFGpA/educatorinnovator.org/how-young-activists-deploy-digital-tools-for-social-change/',
                    lastRef: 'G6uleKglEeeajLv_xfhLEQ',
                    id: '9z8oDqgzEeeOc5_40RkXzA',
                    updated: '2017-10-03T12:11:20.206553+00:00',
                    timestampLink:
                      'https://hypothes.is/a/9z8oDqgzEeeOc5_40RkXzA'
                  },
                  {
                    username: 'dogtrax',
                    displayName: 'dogtrax',
                    text:
                      "And sometimes, media overreaches about the impact of the new and cool tools, and voices, too. We can't seem to find the middle ground of thoughtful understanding and analysis of impact.",
                    date: 'Tue Oct 03 2017',
                    article: false,
                    articleLink:
                      'https://hyp.is/0tJfpqfXEeehVBMVEdFGpA/educatorinnovator.org/how-young-activists-deploy-digital-tools-for-social-change/',
                    lastRef: '0tJfpqfXEeehVBMVEdFGpA',
                    id: 'G6uleKglEeeajLv_xfhLEQ',
                    updated: '2017-10-03T10:24:58.929452+00:00',
                    timestampLink:
                      'https://hypothes.is/a/G6uleKglEeeajLv_xfhLEQ'
                  }
                ]
              }
            }
          }
        }
      }
    }
  ]
};
