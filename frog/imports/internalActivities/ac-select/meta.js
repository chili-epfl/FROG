export default {
  name: 'Words selection',
  shortDesc: 'Reading a text and selecting some words in the text',
  description:
    'Allow the student to select words that are highlighted int the text displayed.',
  category: 'Discipline-specific',
  exampleData: [
    {
      title: 'Lorem Ipsum',
      config: {
        title: 'Lorem Ipsum',
        text:
          "Lorem Ipsum is McDonald dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.\n\n Why do we use it?\n It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).\n\n Where does it come from?\n Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of \"de Finibus Bonorum et Malorum\" (The Extremes of Good and Evil) by Cicero, written in 45 BC. This book is a treatise on the theory of ethics, very popular during the Renaissance. The first line of Lorem Ipsum, \"Lorem ipsum dolor sit amet..\", comes from a line in section 1.10.32."
      },
      activityData: {}
    },
    {
      title: 'German',
      config: {
        title: 'Die Freuden (Goethe)',
        text: `Die Freuden
Es flattert um die Quelle
Die wechselnde Libelle,
Mich freut sie lange schon;
Bald dunkel und bald helle,
Wie der Chamäleon,
Bald rot, bald blau,
Bald blau, bald grün;
O dass ich in der Nähe
Doch ihre Farben sähe!

Sie schwirrt und schwebet, rastet nie!
Doch still, sie setzt sich an die Weiden.
Da hab ich sie! Da hab ich sie!
Und nun betracht ich sie genau,
Und seh ein traurig dunkles Blau -
So geht es dir, Zergliedrer deiner Freuden!`,
        wordPhrases: ['schwirrt und schwebet', 'traurig dunkles Blau']
      },
      activityData: {}
    },
    {
      title: 'Bhagavad Gita (Hindi, non functional)',
      config: {
        title: `प्रथमोऽध्याय: अर्जुनविषाद`,
        text: `
ॐ
श्रीपरमात्मने नमः
अथ श्रीमद्भगवद्गीता
प्रथमोऽध्यायः

धृतराष्ट्र उवाच

धर्मक्षेत्रे कुरुक्षेत्रे समवेता युयुत्सवः । 
मामकाः पाण्डवाश्चैव किमकुर्वत संजय ॥१-१॥

सञ्जय उवाच

दृष्ट्वा तु पाण्डवानीकं व्यूढं दुर्योधनस्तदा ।
आचार्यमुपसंगम्य राजा वचनमब्रवीत् ॥१-२॥

पश्यैतां पाण्डुपुत्राणामाचार्य महतीं चमूम् ।
व्यूढां द्रुपदपुत्रेण तव शिष्येण धीमता ॥१-३॥

अत्र शूरा महेष्वासा भीमार्जुनसमा युधि ।
युयुधानो विराटश्च द्रुपदश्च महारथः ॥१-४॥

धृष्टकेतुश्चेकितानः काशिराजश्च वीर्यवान् ।
पुरुजित्कुन्तिभोजश्च शैब्यश्च नरपुङ्गवः ॥१-५॥

युधामन्युश्च विक्रान्त उत्तमौजाश्च वीर्यवान् ।
सौभद्रो द्रौपदेयाश्च सर्व एव महारथाः ॥१-६॥
    `
      }
    },
    {
      title: 'Russian',
      config: {
        title: 'Бесы (Пушкин)',
        text: `Мчатся тучи, вьются тучи;
Невидимкою луна
Освещает снег летучий;
Мутно небо, ночь мутна.
Еду, еду в чистом поле;
Колокольчик дин-дин-дин...
Страшно, страшно поневоле
Средь неведомых равнин!

«Эй, пошел, ямщик!..» — «Нет мочи:
Коням, барин, тяжело;
Вьюга мне слипает очи;
Все дороги занесло;
Хоть убей, следа не видно;
Сбились мы. Что делать нам!
В поле бес нас водит, видно,
Да кружит по сторонам.

Посмотри: вон, вон играет,
Дует, плюет на меня;
Вон — теперь в овраг толкает
Одичалого коня;
Там верстою небывалой
Он торчал передо мной;
Там сверкнул он искрой малой
И пропал во тьме пустой».

Мчатся тучи, вьются тучи;
Невидимкою луна
Освещает снег летучий;
Мутно небо, ночь мутна.
Сил нам нет кружиться доле;
Колокольчик вдруг умолк;
Кони стали... «Что там в поле?» —
«Кто их знает? пень иль волк?»

Вьюга злится, вьюга плачет;
Кони чуткие храпят;
Вот уж он далече скачет;
Лишь глаза во мгле горят;
Кони снова понеслися;
Колокольчик дин-дин-дин...
Вижу: духи собралися
Средь белеющих равнин.

Бесконечны, безобразны,
В мутной месяца игре
Закружились бесы разны,
Будто листья в ноябре...
Сколько их! куда их гонят?
Что так жалобно поют?
Домового ли хоронят,
Ведьму ль замуж выдают?

Мчатся тучи, вьются тучи;
Невидимкою луна
Освещает снег летучий;
Мутно небо, ночь мутна.
Мчатся бесы рой за роем
В беспредельной вышине,
Визгом жалобным и воем
Надрывая сердце мне...
`
      }
    },
    {
      title: 'Where is the love (Black Eyed Peas)',
      config: {
        title: 'Where is the love (Black Eyed Peas)',
        text: `People killin' people dyin'
Children hurtin', I hear them cryin'
Can you practice what you preachin'?
Would you turn the other cheek again?
Mama, mama, mama, tell us what the hell is goin' on
Can't we all just get along?
Father, father, father help us
Send some guidance from above
'Cause people got me, got me
Questioning

Yo what's going on with the world, momma
Yo people living like they ain't got no mommas
I think they all distracted by the drama and
Attracted to the trauma, mamma
I think they don't understand the concept or
The meaning of karma

Overseas, yeah they trying to stop terrorism
Over here on the streets the police shoot
The people put the bullets in 'em
But if you only got love for your own race
Then you're gonna leave space for others to discriminate

And to discriminate only generates hate
And when you hate then you're bound to get irate
Madness is what you demonstrate
And that's exactly how hate works and operates
Man, we gotta set it straight
Take control of your mind and just meditate
And let your soul just gravitate
To the love, so the whole world celebrate it

People killin' people dyin' …

It just ain't the same, always in change
New days are strange, is the world insane?
Nation droppin' bombs killing our little ones
Ongoing suffering as the youth die young

Where's the love when a child gets murdered
Or a cop gets knocked down
Black lives not now
Everybody matter to me
All races, y'all don't like what I'm sayin'? Haterade, tall cases
Everybody hate somebody
Guess we all racist
Black Eyed Peas do a song about love and y'all hate this
All these protests with different colored faces
We was all born with a heart
Why we gotta chase it?
And every time I look around

Every time I look up, every time I look down
No one's on a common ground
And if you never speak truth then you never know how love sounds
And if you never know love then you never know God, wow
Where's the love y'all? I don't, I don't know
Where's the truth y'all? I don't know

People killin' people dyin' …

Love is the key
Love is the answer
Love is the solution
They don't want us to love
Love is powerful

My mama asked me why I never vote never vote
'Cause police men want me dead and gone (Dead and gone)
That election looking like a joke (Such a joke)
And the weed man still sellin' dope
Somebody gotta give these niggas hope (Please hope)
All he ever wanted was a smoke (My gosh)
Said he can't breathe with his hands in the air
Layin' on the ground died from a choke

I feel the weight of the world on my shoulders
As I'm gettin' older y'all people gets colder
Most of us only care about money makin'
Selfishness got us followin' the wrong direction
Wrong information always shown by the media
Negative images is the main criteria
Infecting the young minds faster than bacteria
Kids wanna act like what they see in the cinemas
What happened to the love and the values of humanity?
What happened to the love and the fairness and equality?
(Instead of spreading love we're spreading animosity
Lack of understanding leading us away from unity`
      },
      activityData: {}
    },
    {
      title: 'Welcome to Chinatown - with merging incoming highlights',
      config: {
        title: 'Welcome to Chinatown',
        text:
          'Visiting Toronto’s Chinatown can be an exciting experience for anyone. There are a number of shops, restaurants, activities, historic monuments, and even spas to check out when you visit China-town. You will be able to kick back, relax, and spend the whole weekend at Chinatown without having to worry. This is because the atmosphere is very laid back, and relaxed.\n \nTaste some of the Chinese culture when you visit one of the finest restaurants that Chinatown has to offer. They offer only the freshest ingredients, and ensure that you leave their restaurant feeling happy and full. This is essential when finding a great place to eat after a long day of walking through Chinatown’s streets. They cater large parties, so if you’re with your family, or walking with a tour group, you can ensure that everyone will be fed. Choose your favorite Chinatown restaurant, and visit again for more wonderful food.\n \nPick up some herbs or other Chinese remedies when you visit. This will allow you to grab everything you need at affordable prices before you go back home. Try new remedies, and allow yourself to learn the Chinese way when it comes to home healing. There are also tours going on throughout Chinatown. Hook up with a group, and explore Chinatown together. This is an ex-citing, and rewarding experience. Their festivities going on throughout the weekends have free admission, so jump in and watch the traditional lion dances, or make hands on cultural crafts.\n \nThere is something for everyone in Chinatown. You can bring the whole family; Chinatown is open to all guests of all ages. If you would rather not leave for the day, then stay at one of the best hotels in Chinatown. They are clean, affordable, and you can rest easy knowing you’re in good hands. Check out Toronto’s Chinatown today, you will leave feeling refreshed, knowledgeable, well fed, and most of all with goodies to bring home for everyone.'
      },
      data: {
        cjnztobxc000001rscwxwedf1: {
          category: 'Yellow',
          id: 'cjnztobxc000001rscwxwedf1',
          li: {
            liDocument: {
              createdAt: '2018-11-02T09:34:31.777Z',
              createdBy: 'ac-select',
              liType: 'li-wordSelect',
              payload: {
                color: '#FFFF00',
                word: 'ensure'
              }
            }
          },
          score: 11
        },
        cjnztobxd000101rsubxq49rp: {
          category: 'Yellow',
          id: 'cjnztobxd000101rsubxq49rp',
          li: {
            liDocument: {
              createdAt: '2018-11-02T09:34:31.777Z',
              createdBy: 'ac-select',
              liType: 'li-wordSelect',
              payload: {
                color: '#FFFF00',
                word: 'cater'
              }
            }
          },
          score: 10
        },
        cjnztobxd000201rs6bi8xbkl: {
          category: 'Yellow',
          id: 'cjnztobxd000201rs6bi8xbkl',
          li: {
            liDocument: {
              createdAt: '2018-11-02T09:34:31.777Z',
              createdBy: 'ac-select',
              liType: 'li-wordSelect',
              payload: {
                color: '#FFFF00',
                word: 'laid'
              }
            }
          },
          score: 7
        },
        cjnztobxd000301rsukqvu1ys: {
          category: 'Yellow',
          id: 'cjnztobxd000301rsukqvu1ys',
          li: {
            liDocument: {
              createdAt: '2018-11-02T09:34:31.777Z',
              createdBy: 'ac-select',
              liType: 'li-wordSelect',
              payload: {
                color: '#FFFF00',
                word: 'food'
              }
            }
          },
          score: 1
        },
        cjnztobxd000401rs0su1c3l3: {
          category: 'Yellow',
          id: 'cjnztobxd000401rs0su1c3l3',
          li: {
            liDocument: {
              createdAt: '2018-11-02T09:34:31.777Z',
              createdBy: 'ac-select',
              liType: 'li-wordSelect',
              payload: {
                color: '#FFFF00',
                word: 'remedies'
              }
            }
          },
          score: 13
        },
        cjnztobxd000501rsrmv4r6j4: {
          category: 'Yellow',
          id: 'cjnztobxd000501rsrmv4r6j4',
          li: {
            liDocument: {
              createdAt: '2018-11-02T09:34:31.777Z',
              createdBy: 'ac-select',
              liType: 'li-wordSelect',
              payload: {
                color: '#FFFF00',
                word: 'fed'
              }
            }
          },
          score: 9
        },
        cjnztobxd000601rs9hojwqbf: {
          category: 'Yellow',
          id: 'cjnztobxd000601rs9hojwqbf',
          li: {
            liDocument: {
              createdAt: '2018-11-02T09:34:31.777Z',
              createdBy: 'ac-select',
              liType: 'li-wordSelect',
              payload: {
                color: '#FFFF00',
                word: 'goodies'
              }
            }
          },
          score: 4
        },
        cjnztobxd000701rsdb2cyaua: {
          category: 'Yellow',
          id: 'cjnztobxd000701rsdb2cyaua',
          li: {
            liDocument: {
              createdAt: '2018-11-02T09:34:31.777Z',
              createdBy: 'ac-select',
              liType: 'li-wordSelect',
              payload: {
                color: '#FFFF00',
                word: 'well'
              }
            }
          },
          score: 1
        },
        cjnztobxd000a01rs2rz5a3f1: {
          category: 'Yellow',
          id: 'cjnztobxd000a01rs2rz5a3f1',
          li: {
            liDocument: {
              createdAt: '2018-11-02T09:34:31.777Z',
              createdBy: 'ac-select',
              liType: 'li-wordSelect',
              payload: {
                color: '#FFFF00',
                word: 'monuments'
              }
            }
          },
          score: 1
        },
        cjnztobxd000b01rsq9rzwbnw: {
          category: 'Yellow',
          id: 'cjnztobxd000b01rsq9rzwbnw',
          li: {
            liDocument: {
              createdAt: '2018-11-02T09:34:31.777Z',
              createdBy: 'ac-select',
              liType: 'li-wordSelect',
              payload: {
                color: '#FFFF00',
                word: 'spas'
              }
            }
          },
          score: 5
        },
        cjnztobxd000c01rs5837t1nb: {
          category: 'Yellow',
          id: 'cjnztobxd000c01rs5837t1nb',
          li: {
            liDocument: {
              createdAt: '2018-11-02T09:34:31.777Z',
              createdBy: 'ac-select',
              liType: 'li-wordSelect',
              payload: {
                color: '#FFFF00',
                word: 'finest'
              }
            }
          },
          score: 1
        },
        cjnztobxd000d01rsos3pzk93: {
          category: 'Yellow',
          id: 'cjnztobxd000d01rsos3pzk93',
          li: {
            liDocument: {
              createdAt: '2018-11-02T09:34:31.777Z',
              createdBy: 'ac-select',
              liType: 'li-wordSelect',
              payload: {
                color: '#FFFF00',
                word: 'essential'
              }
            }
          },
          score: 8
        },
        cjnztobxd000g01rss2uml8sw: {
          category: 'Yellow',
          id: 'cjnztobxd000g01rss2uml8sw',
          li: {
            liDocument: {
              createdAt: '2018-11-02T09:34:31.777Z',
              createdBy: 'ac-select',
              liType: 'li-wordSelect',
              payload: {
                color: '#FFFF00',
                word: 'affordable'
              }
            }
          },
          score: 9
        },
        cjnztobxd000h01rsf0buqcgv: {
          category: 'Yellow',
          id: 'cjnztobxd000h01rsf0buqcgv',
          li: {
            liDocument: {
              createdAt: '2018-11-02T09:34:31.777Z',
              createdBy: 'ac-select',
              liType: 'li-wordSelect',
              payload: {
                color: '#FFFF00',
                word: 'festivities'
              }
            }
          },
          score: 1
        },
        cjnztobxd000i01rs063z0zp7: {
          category: 'Yellow',
          id: 'cjnztobxd000i01rs063z0zp7',
          li: {
            liDocument: {
              createdAt: '2018-11-02T09:34:31.777Z',
              createdBy: 'ac-select',
              liType: 'li-wordSelect',
              payload: {
                color: '#FFFF00',
                word: 'knowledgeable'
              }
            }
          },
          score: 5
        },
        cjnztobxd000k01rsoje1zpzr: {
          category: 'Yellow',
          id: 'cjnztobxd000k01rsoje1zpzr',
          li: {
            liDocument: {
              createdAt: '2018-11-02T09:34:31.777Z',
              createdBy: 'ac-select',
              liType: 'li-wordSelect',
              payload: {
                color: '#FFFF00',
                word: 'rewarding'
              }
            }
          },
          score: 7
        },
        cjnztobxd000u01rs7ei9gul2: {
          category: 'Yellow',
          id: 'cjnztobxd000u01rs7ei9gul2',
          li: {
            liDocument: {
              createdAt: '2018-11-02T09:34:31.777Z',
              createdBy: 'ac-select',
              liType: 'li-wordSelect',
              payload: {
                color: '#FFFF00',
                word: 'grab'
              }
            }
          },
          score: 4
        },
        cjnztobxd000w01rs6rq5av1v: {
          category: 'Yellow',
          id: 'cjnztobxd000w01rs6rq5av1v',
          li: {
            liDocument: {
              createdAt: '2018-11-02T09:34:31.777Z',
              createdBy: 'ac-select',
              liType: 'li-wordSelect',
              payload: {
                color: '#FFFF00',
                word: 'healing'
              }
            }
          },
          score: 7
        },
        cjnztobxd000x01rs0z29dwd5: {
          category: 'Yellow',
          id: 'cjnztobxd000x01rs0z29dwd5',
          li: {
            liDocument: {
              createdAt: '2018-11-02T09:34:31.777Z',
              createdBy: 'ac-select',
              liType: 'li-wordSelect',
              payload: {
                color: '#FFFF00',
                word: 'hook'
              }
            }
          },
          score: 1
        },
        cjnztobxd000z01rskg6zs6cb: {
          category: 'Yellow',
          id: 'cjnztobxd000z01rskg6zs6cb',
          li: {
            liDocument: {
              createdAt: '2018-11-02T09:34:31.777Z',
              createdBy: 'ac-select',
              liType: 'li-wordSelect',
              payload: {
                color: '#FFFF00',
                word: 'admission'
              }
            }
          },
          score: 3
        },
        cjnztobxd001001rsp9q3nk23: {
          category: 'Yellow',
          id: 'cjnztobxd001001rsp9q3nk23',
          li: {
            liDocument: {
              createdAt: '2018-11-02T09:34:31.777Z',
              createdBy: 'ac-select',
              liType: 'li-wordSelect',
              payload: {
                color: '#FFFF00',
                word: 'crafts'
              }
            }
          },
          score: 1
        },
        cjnztobxd001101rsuotggtw6: {
          category: 'Yellow',
          id: 'cjnztobxd001101rsuotggtw6',
          li: {
            liDocument: {
              createdAt: '2018-11-02T09:34:31.777Z',
              createdBy: 'ac-select',
              liType: 'li-wordSelect',
              payload: {
                color: '#FFFF00',
                word: 'everyone'
              }
            }
          },
          score: 1
        },
        cjnztobxd001601rsk4g1126w: {
          category: 'Yellow',
          id: 'cjnztobxd001601rsk4g1126w',
          li: {
            liDocument: {
              createdAt: '2018-11-02T09:34:31.777Z',
              createdBy: 'ac-select',
              liType: 'li-wordSelect',
              payload: {
                color: '#FFFF00',
                word: 'herbs'
              }
            }
          },
          score: 3
        },
        cjnztobxd001a01rsc77ypiq9: {
          category: 'Yellow',
          id: 'cjnztobxd001a01rsc77ypiq9',
          li: {
            liDocument: {
              createdAt: '2018-11-02T09:34:31.777Z',
              createdBy: 'ac-select',
              liType: 'li-wordSelect',
              payload: {
                color: '#FFFF00',
                word: 'restaurants'
              }
            }
          },
          score: 1
        },
        cjnztobxd001f01rsonkjs1k6: {
          category: 'Yellow',
          id: 'cjnztobxd001f01rsonkjs1k6',
          li: {
            liDocument: {
              createdAt: '2018-11-02T09:34:31.778Z',
              createdBy: 'ac-select',
              liType: 'li-wordSelect',
              payload: {
                color: '#FFFF00',
                word: 'exciting'
              }
            }
          },
          score: 3
        },
        cjnztobxe001g01rsylpp5wqa: {
          category: 'Yellow',
          id: 'cjnztobxe001g01rsylpp5wqa',
          li: {
            liDocument: {
              createdAt: '2018-11-02T09:34:31.778Z',
              createdBy: 'ac-select',
              liType: 'li-wordSelect',
              payload: {
                color: '#FFFF00',
                word: 'experience'
              }
            }
          },
          score: 3
        },
        cjnztobxe001o01rswyp6azzz: {
          category: 'Yellow',
          id: 'cjnztobxe001o01rswyp6azzz',
          li: {
            liDocument: {
              createdAt: '2018-11-02T09:34:31.778Z',
              createdBy: 'ac-select',
              liType: 'li-wordSelect',
              payload: {
                color: '#FFFF00',
                word: 'ex'
              }
            }
          },
          score: 2
        },
        cjnztobxe001p01rse6ycmq63: {
          category: 'Yellow',
          id: 'cjnztobxe001p01rse6ycmq63',
          li: {
            liDocument: {
              createdAt: '2018-11-02T09:34:31.778Z',
              createdBy: 'ac-select',
              liType: 'li-wordSelect',
              payload: {
                color: '#FFFF00',
                word: 'citing'
              }
            }
          },
          score: 2
        },
        cjnztobxe001t01rsmzx9b0dq: {
          category: 'Yellow',
          id: 'cjnztobxe001t01rsmzx9b0dq',
          li: {
            liDocument: {
              createdAt: '2018-11-02T09:34:31.778Z',
              createdBy: 'ac-select',
              liType: 'li-wordSelect',
              payload: {
                color: '#FFFF00',
                word: 'relaxed'
              }
            }
          },
          score: 1
        },
        cjnztobxe001x01rsk73e6pev: {
          category: 'Yellow',
          id: 'cjnztobxe001x01rsk73e6pev',
          li: {
            liDocument: {
              createdAt: '2018-11-02T09:34:31.778Z',
              createdBy: 'ac-select',
              liType: 'li-wordSelect',
              payload: {
                color: '#FFFF00',
                word: 'able'
              }
            }
          },
          score: 1
        },
        cjnztobxe002001rs8li6cc54: {
          category: 'Yellow',
          id: 'cjnztobxe002001rs8li6cc54',
          li: {
            liDocument: {
              createdAt: '2018-11-02T09:34:31.778Z',
              createdBy: 'ac-select',
              liType: 'li-wordSelect',
              payload: {
                color: '#FFFF00',
                word: 'ingredients'
              }
            }
          },
          score: 1
        },
        cjnztobxe002301rs1f6lr8ql: {
          category: 'Yellow',
          id: 'cjnztobxe002301rs1f6lr8ql',
          li: {
            liDocument: {
              createdAt: '2018-11-02T09:34:31.778Z',
              createdBy: 'ac-select',
              liType: 'li-wordSelect',
              payload: {
                color: '#FFFF00',
                word: 'allow'
              }
            }
          },
          score: 2
        },
        cjnztobxe002l01rsrbrjp1vg: {
          category: 'Yellow',
          id: 'cjnztobxe002l01rsrbrjp1vg',
          li: {
            liDocument: {
              createdAt: '2018-11-02T09:34:31.778Z',
              createdBy: 'ac-select',
              liType: 'li-wordSelect',
              payload: {
                color: '#FFFF00',
                word: 'throughout'
              }
            }
          },
          score: 1
        },
        cjnztobxe002r01rs3paz409l: {
          category: 'Yellow',
          id: 'cjnztobxe002r01rs3paz409l',
          li: {
            liDocument: {
              createdAt: '2018-11-02T09:34:31.778Z',
              createdBy: 'ac-select',
              liType: 'li-wordSelect',
              payload: {
                color: '#FFFF00',
                word: 'refreshed'
              }
            }
          },
          score: 1
        },
        cjnztobxf003d01rsf7nlsllz: {
          category: 'Yellow',
          id: 'cjnztobxf003d01rsf7nlsllz',
          li: {
            liDocument: {
              createdAt: '2018-11-02T09:34:31.779Z',
              createdBy: 'ac-select',
              liType: 'li-wordSelect',
              payload: {
                color: '#FFFF00',
                word: 'lion'
              }
            }
          },
          score: 1
        },
        cjnztobxf003e01rsa9ne22xi: {
          category: 'Yellow',
          id: 'cjnztobxf003e01rsa9ne22xi',
          li: {
            liDocument: {
              createdAt: '2018-11-02T09:34:31.779Z',
              createdBy: 'ac-select',
              liType: 'li-wordSelect',
              payload: {
                color: '#FFFF00',
                word: 'dances'
              }
            }
          },
          score: 1
        }
      }
    }
  ]
};
