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

export const meta = {
  name: 'Gallery',
  type: 'react-component',
  shortDesc: 'Display learning items',
  description:
    'Display a list of learning items, possibly categorised, option to allow upload and voting',
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
        a4: { id: 'a4', li: '4' }
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
        a1: { id: 'a1', li: '1', categories: ['tree', 'house'] },
        a2: { id: 'a2', li: '2', category: 'tree' },
        a3: { id: 'a3', li: '3', category: 'house' },
        a4: { id: 'a4', li: '4', categories: ['sky', 'tree'] }
      }
    },
    {
      title: 'Hypothesis LIs',
      config: {
        guidelines: 'Here are many Hypothes.is items',
        canVote: true,
        canComment: true
      },
      data: {
        cjjpgni2v001g6wiuf6qbgax6: {
          id: 'cjjpgni2v001g6wiuf6qbgax6',
          votes: {},
          comment: '',
          li: {
            id: 'cjjpgni2h000c6wiu0xp0ukp5',
            liDocument: {
              liType: 'li-hypothesis',
              createdAt: '2018-07-17T08:53:26.969Z',
              createdBy: 'op-hypothesis',
              payload: {
                content:
                  "This is a great example of Kohonen's Self-organizing Maps  and the use of the U-Matrix. The authors were very thorough in explaining how it can be used.",
                title: 'Appendix. Technical demonstration of the SOMprocedure',
                doc: 'doi:10.1016/j.ejor.2006.06.006'
              }
            }
          }
        },
        cjjpgni2w001h6wiu2wnhdnmf: {
          id: 'cjjpgni2w001h6wiu2wnhdnmf',
          votes: {},
          comment: '',
          li: {
            id: 'cjjpgni2h000d6wiuekzknfjb',
            liDocument: {
              liType: 'li-hypothesis',
              createdAt: '2018-07-17T08:53:26.969Z',
              createdBy: 'op-hypothesis',
              payload: {
                content: 'Data Structure',
                title:
                  'The SOM consisted of 360 neurons on a 24by  15  map  grid,  with  hexagonal  lattice  andGaussian neighborhood  function.',
                doc: 'doi:10.1016/j.ejor.2006.06.006'
              }
            }
          }
        },
        cjjpgni2w001i6wiucg64r256: {
          id: 'cjjpgni2w001i6wiucg64r256',
          votes: {},
          comment: '',
          li: {
            id: 'cjjpgni2h000e6wiudkevnugi',
            liDocument: {
              liType: 'li-hypothesis',
              createdAt: '2018-07-17T08:53:26.969Z',
              createdBy: 'op-hypothesis',
              payload: {
                content:
                  'This is the novel innovation approach to network analysis that I will be discussing in my article review presentation\n',
                title: '(Kohonen’s Self-Organizing Maps',
                doc: 'doi:10.1016/j.ejor.2006.06.006'
              }
            }
          }
        },
        cjjpgni2w001j6wiugb0udy1l: {
          id: 'cjjpgni2w001j6wiugb0udy1l',
          votes: {},
          comment: '',
          li: {
            id: 'cjjpgni2h000f6wiuzp0jdom1',
            liDocument: {
              liType: 'li-hypothesis',
              createdAt: '2018-07-17T08:53:26.969Z',
              createdBy: 'op-hypothesis',
              payload: {
                content:
                  'I really like this concept and application of SNA with integration of critical discourse analysis (CDA), which is a course I am taking in the fall!! In another class, we read about critical quantitative approach, and I now think what makes it truly critical might be the integration of a mixed method approach, where something like ethnographic case studies or in this case discourse analysis is used in combination with SNA/statistical analyses to give it more robust findings.',
                title: `Ryu, S., & Lombardi, D. (2015). Coding Classroom Interactions for Collective and Individual Engagement. Educational Psychologist, 50(1), 70–83. http://doi.org/10.1080/00461520.2014.1001891 (Note: An attempt to combine SNA with critical discourse analysis.)`,
                doc: 'Social Network Analysis in Education'
              }
            }
          }
        },
        cjjpgni2w001k6wiuoe9g3e36: {
          id: 'cjjpgni2w001k6wiuoe9g3e36',
          votes: {},
          comment: '',
          li: {
            id: 'cjjpgni2h000g6wiue5j7jv6k',
            liDocument: {
              liType: 'li-hypothesis',
              createdAt: '2018-07-17T08:53:26.969Z',
              createdBy: 'op-hypothesis',
              payload: {
                content:
                  'The paper I read for the previous assignment was a good example of statistical analysis of SNA data.',
                title: '',
                doc:
                  'An Introduction to Statistical Inference With Network Data - SAGE Research Methods'
              }
            }
          }
        },
        cjjpgni2w001l6wiu14jo3eg3: {
          id: 'cjjpgni2w001l6wiu14jo3eg3',
          votes: {},
          comment: '',
          li: {
            id: 'cjjpgni2h000h6wiua8i2rj23',
            liDocument: {
              liType: 'li-hypothesis',
              createdAt: '2018-07-17T08:53:26.969Z',
              createdBy: 'op-hypothesis',
              payload: {
                content:
                  'These are important questions that need answered to truly understand complex social interactions.',
                title: ' address the questions in the previous paragraph',
                doc:
                  'An Introduction to Statistical Inference With Network Data - SAGE Research Methods'
              }
            }
          }
        },
        cjjpgni2w001m6wiuhqx2wsip: {
          id: 'cjjpgni2w001m6wiuhqx2wsip',
          votes: {},
          comment: '',
          li: {
            id: 'cjjpgni2h000i6wiugdz8xnbh',
            liDocument: {
              liType: 'li-hypothesis',
              createdAt: '2018-07-17T08:53:26.969Z',
              createdBy: 'op-hypothesis',
              payload: {
                content:
                  'I found the matrix way more tedious that just making a simpler list of sources and targets.  Plus R liked it way better.',
                title: '',
                doc: 'Looking Back, Looking Ahead - SAGE Research Methods'
              }
            }
          }
        },
        cjjpgni2w001n6wiu4ms77i6c: {
          id: 'cjjpgni2w001n6wiu4ms77i6c',
          votes: {},
          comment: '',
          li: {
            id: 'cjjpgni2h000j6wiutyk2149d',
            liDocument: {
              liType: 'li-hypothesis',
              createdAt: '2018-07-17T08:53:26.969Z',
              createdBy: 'op-hypothesis',
              payload: {
                content: 'Does it really?!  Is that a thing?',
                title: '',
                doc: 'Looking Back, Looking Ahead - SAGE Research Methods'
              }
            }
          }
        },
        cjjpgni2w001o6wiut0ml04d3: {
          id: 'cjjpgni2w001o6wiut0ml04d3',
          votes: {},
          comment: '',
          li: {
            id: 'cjjpgni2h000k6wiu2mbgwxa9',
            liDocument: {
              liType: 'li-hypothesis',
              createdAt: '2018-07-17T08:53:26.969Z',
              createdBy: 'op-hypothesis',
              payload: {
                content:
                  "Tiahui's right--I'm referring to the Community of Inquiry's social presence and cognitive presence.  I resort to abbreviations because I get tired of writing them out all the time.  So CoI, SP, and CP. :)",
                title: '',
                doc: 'Looking Back, Looking Ahead - SAGE Research Methods'
              }
            }
          }
        },
        cjjpgni2w001p6wiu5whbhve3: {
          id: 'cjjpgni2w001p6wiu5whbhve3',
          votes: {},
          comment: '',
          li: {
            id: 'cjjpgni2h000l6wiu5xgqc4jf',
            liDocument: {
              liType: 'li-hypothesis',
              createdAt: '2018-07-17T08:53:26.969Z',
              createdBy: 'op-hypothesis',
              payload: {
                content:
                  'Never too late! The course project is seen as an evolving piece, instead of an end-product. ',
                title: '',
                doc: 'Looking Back, Looking Ahead - SAGE Research Methods'
              }
            }
          }
        },
        cjjpgni2w001q6wiu7aml0nyh: {
          id: 'cjjpgni2w001q6wiu7aml0nyh',
          votes: {},
          comment: '',
          li: {
            id: 'cjjpgni2i000m6wiuc229u04i',
            liDocument: {
              liType: 'li-hypothesis',
              createdAt: '2018-07-17T08:53:26.970Z',
              createdBy: 'op-hypothesis',
              payload: {
                content:
                  "You guys have made some really important points! Yes, so many things we do and study are in circles. Think about tacit-explicit knowledge, 'expansive learning', etc. Learning, research and innovation are never linear :). So, nice recognition! ",
                title: '',
                doc: 'Looking Back, Looking Ahead - SAGE Research Methods'
              }
            }
          }
        },
        cjjpgni2w001r6wiuj93q5nur: {
          id: 'cjjpgni2w001r6wiuj93q5nur',
          votes: {},
          comment: '',
          li: {
            id: 'cjjpgni2i000n6wiutearl3yb',
            liDocument: {
              liType: 'li-hypothesis',
              createdAt: '2018-07-17T08:53:26.970Z',
              createdBy: 'op-hypothesis',
              payload: {
                content:
                  "Agreed. I am at a conference and a speaker just talked about the importance of interdisciplinary while many others are arguing for 'purity' https://twitter.com/bod0ng/status/854710273353142272  The call for consulting lit outside of education is a good thing to remember.",
                title: '',
                doc: 'Looking Back, Looking Ahead - SAGE Research Methods'
              }
            }
          }
        },
        cjjpgni2w001s6wiu96xebudy: {
          id: 'cjjpgni2w001s6wiu96xebudy',
          votes: {},
          comment: '',
          li: {
            id: 'cjjpgni2i000o6wiuwdnclpk0',
            liDocument: {
              liType: 'li-hypothesis',
              createdAt: '2018-07-17T08:53:26.970Z',
              createdBy: 'op-hypothesis',
              payload: {
                content:
                  'exactly! This happens when we deal with real-world (vs lab) settings',
                title: '',
                doc: 'Looking Back, Looking Ahead - SAGE Research Methods'
              }
            }
          }
        },
        cjjpgni2w001t6wiutksy54ef: {
          id: 'cjjpgni2w001t6wiutksy54ef',
          votes: {},
          comment: '',
          li: {
            id: 'cjjpgni2i000p6wiuutig7t04',
            liDocument: {
              liType: 'li-hypothesis',
              createdAt: '2018-07-17T08:53:26.970Z',
              createdBy: 'op-hypothesis',
              payload: {
                content:
                  "my work has been mostly based on digital traces of a whole network. So my expertise in this are is thin. Please investigate and share back! I'd love to learn.",
                title: '',
                doc: 'Looking Back, Looking Ahead - SAGE Research Methods'
              }
            }
          }
        },
        cjjpgni2x001u6wiuedxlsrrv: {
          id: 'cjjpgni2x001u6wiuedxlsrrv',
          votes: {},
          comment: '',
          li: {
            id: 'cjjpgni2i000q6wiunuovlpik',
            liDocument: {
              liType: 'li-hypothesis',
              createdAt: '2018-07-17T08:53:26.970Z',
              createdBy: 'op-hypothesis',
              payload: {
                content:
                  'It really depends on the type of study being conducted. In my case, I would be looking at ties among businesses in certain countries. None of the information I am using was confidential in the first place. However, I do agree that IRB approval is needed when trying to publish in an academic journal.',
                title: '',
                doc: 'Looking Back, Looking Ahead - SAGE Research Methods'
              }
            }
          }
        },
        cjjpgni2x001v6wiuzp5liiqr: {
          id: 'cjjpgni2x001v6wiuzp5liiqr',
          votes: {},
          comment: '',
          li: {
            id: 'cjjpgni2i000r6wiuiaajaatz',
            liDocument: {
              liType: 'li-hypothesis',
              createdAt: '2018-07-17T08:53:26.970Z',
              createdBy: 'op-hypothesis',
              payload: {
                content:
                  "I am familiar with SPSS, but I had not considered using it for my final project until now. I am a little confused about how I would have to code the data (adjacency matrix) so that it works well in SPSS, but I think I'm going to try it just to see if I can get the same results that I obtain from using R.",
                title:
                  'analyses using these ego-level measures can be done using statistical packages like SPSS',
                doc: 'Looking Back, Looking Ahead - SAGE Research Methods'
              }
            }
          }
        },
        cjjpgni2x001w6wiuioaimmax: {
          id: 'cjjpgni2x001w6wiuioaimmax',
          votes: {},
          comment: '',
          li: {
            id: 'cjjpgni2i000s6wiupj0xbrtv',
            liDocument: {
              liType: 'li-hypothesis',
              createdAt: '2018-07-17T08:53:26.970Z',
              createdBy: 'op-hypothesis',
              payload: {
                content:
                  'I am interested in learning more about the NetDraw software in UCINET. While I like statistics, nothing really says SNA like having clear visuals that display network ties',
                title:
                  'UCINET is NetDraw, a visualization tool that has advanced graphic properties.',
                doc: 'Looking Back, Looking Ahead - SAGE Research Methods'
              }
            }
          }
        },
        cjjpgni2x001x6wiumrsz4crt: {
          id: 'cjjpgni2x001x6wiumrsz4crt',
          votes: {},
          comment: '',
          li: {
            id: 'cjjpgni2i000t6wiu759rtgdz',
            liDocument: {
              liType: 'li-hypothesis',
              createdAt: '2018-07-17T08:53:26.970Z',
              createdBy: 'op-hypothesis',
              payload: {
                content:
                  "I need to more practice with creating cleaner graphs that show my network. So far, I've been sticking with the orange and blue colors but I plan to get a little more creative for the final project",
                title:
                  'visualizing your network in the form of a graph provides some hints as to whether your motivating research questions or hypotheses are worth pursuing or in need of revision.Figure',
                doc: 'Looking Back, Looking Ahead - SAGE Research Methods'
              }
            }
          }
        },
        cjjpgni2x001y6wiu00canaux: {
          id: 'cjjpgni2x001y6wiu00canaux',
          votes: {},
          comment: '',
          li: {
            id: 'cjjpgni2i000u6wiuhh252jcu',
            liDocument: {
              liType: 'li-hypothesis',
              createdAt: '2018-07-17T08:53:26.970Z',
              createdBy: 'op-hypothesis',
              payload: {
                content:
                  "My project deviated from the author's process because I actually obtained the dataset before identifying research questions. I am using a public dataset so I had to develop me project around what I had available",
                title:
                  "Now that your network's boundary has been specified, you are ready to collect your data.",
                doc: 'Looking Back, Looking Ahead - SAGE Research Methods'
              }
            }
          }
        },
        cjjpgni2x001z6wiuagnz0pck: {
          id: 'cjjpgni2x001z6wiuagnz0pck',
          votes: {},
          comment: '',
          li: {
            id: 'cjjpgni2i000v6wiuloawpcgk',
            liDocument: {
              liType: 'li-hypothesis',
              createdAt: '2018-07-17T08:53:26.970Z',
              createdBy: 'op-hypothesis',
              payload: {
                content:
                  "Throughout the semester, I have struggled with turning my research topic into a researchable question. I think I've come up with some decent questions, but I'm constantly rewording them.",
                title:
                  ' First, start with an initial topic of interest and then turn this topic into a question. ',
                doc: 'Looking Back, Looking Ahead - SAGE Research Methods'
              }
            }
          }
        }
      }
    }
  ]
};
