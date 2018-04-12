// @flow

export default [
  {
    title: 'Learning about SETs',
    config: {
      title: 'a set',
      partStr: 'e6,f4,d,t6',
      definition:
        'A set is group of three objects such that if 2 objects share a property (same shape or same filling), the 3rd object must share it too.',
      properties: [
        'At least one element is not filled',
        'At most one element is filled',
        'they all have the same shape',
        'they all have the same color',
        'they all have different shapes',
        'they all have different colors',
        'Exactly two elements have the same shape',
        'Exactly two elements have the same filling'
      ],
      suffisantSets: '{2,3},{2,5},{3,4},{5,4}',
      contradictoryProperties: '6,7',
      unnecessaryProperties: '0,1,2,3,4,5',
      examples: [
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img000.png',
          isIncorrect: false,
          respectedProperties: '2,3,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img001.png',
          isIncorrect: true,
          respectedProperties: '6,3,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img002.png',
          isIncorrect: true,
          respectedProperties: '6,3,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img003.png',
          isIncorrect: true,
          respectedProperties: '2,7,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img004.png',
          isIncorrect: true,
          respectedProperties: '6,7,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img005.png',
          isIncorrect: true,
          respectedProperties: '6,7,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img006.png',
          isIncorrect: true,
          respectedProperties: '2,7,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img007.png',
          isIncorrect: true,
          respectedProperties: '6,7,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img008.png',
          isIncorrect: true,
          respectedProperties: '6,7,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img010.png',
          isIncorrect: true,
          respectedProperties: '6,3,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img011.png',
          isIncorrect: true,
          respectedProperties: '6,3,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img012.png',
          isIncorrect: false,
          respectedProperties: '4,3,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img013.png',
          isIncorrect: true,
          respectedProperties: '6,7,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img014.png',
          isIncorrect: true,
          respectedProperties: '6,7,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img015.png',
          isIncorrect: true,
          respectedProperties: '4,7,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img016.png',
          isIncorrect: true,
          respectedProperties: '6,7,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img017.png',
          isIncorrect: true,
          respectedProperties: '6,7,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img018.png',
          isIncorrect: true,
          respectedProperties: '4,7,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img020.png',
          isIncorrect: true,
          respectedProperties: '6,3,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img021.png',
          isIncorrect: false,
          respectedProperties: '4,3,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img022.png',
          isIncorrect: true,
          respectedProperties: '6,3,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img023.png',
          isIncorrect: true,
          respectedProperties: '6,7,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img024.png',
          isIncorrect: true,
          respectedProperties: '4,7,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img025.png',
          isIncorrect: true,
          respectedProperties: '6,7,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img026.png',
          isIncorrect: true,
          respectedProperties: '6,7,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img027.png',
          isIncorrect: true,
          respectedProperties: '4,7,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img028.png',
          isIncorrect: true,
          respectedProperties: '6,7,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img030.png',
          isIncorrect: true,
          respectedProperties: '2,7,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img031.png',
          isIncorrect: true,
          respectedProperties: '6,7,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img032.png',
          isIncorrect: true,
          respectedProperties: '6,7,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img033.png',
          isIncorrect: true,
          respectedProperties: '2,7,0'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img034.png',
          isIncorrect: true,
          respectedProperties: '6,7,0'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img035.png',
          isIncorrect: true,
          respectedProperties: '6,7,0'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img036.png',
          isIncorrect: false,
          respectedProperties: '2,5,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img037.png',
          isIncorrect: true,
          respectedProperties: '6,5,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img038.png',
          isIncorrect: true,
          respectedProperties: '6,5,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img040.png',
          isIncorrect: true,
          respectedProperties: '6,7,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img041.png',
          isIncorrect: true,
          respectedProperties: '6,7,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img042.png',
          isIncorrect: true,
          respectedProperties: '4,7,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img043.png',
          isIncorrect: true,
          respectedProperties: '6,7,0'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img044.png',
          isIncorrect: true,
          respectedProperties: '6,7,0'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img045.png',
          isIncorrect: true,
          respectedProperties: '4,7,0'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img046.png',
          isIncorrect: true,
          respectedProperties: '6,5,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img047.png',
          isIncorrect: true,
          respectedProperties: '6,5,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img048.png',
          isIncorrect: false,
          respectedProperties: '4,5,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img050.png',
          isIncorrect: true,
          respectedProperties: '6,7,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img051.png',
          isIncorrect: true,
          respectedProperties: '4,7,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img052.png',
          isIncorrect: true,
          respectedProperties: '6,7,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img053.png',
          isIncorrect: true,
          respectedProperties: '6,7,0'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img054.png',
          isIncorrect: true,
          respectedProperties: '4,7,0'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img055.png',
          isIncorrect: true,
          respectedProperties: '6,7,0'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img056.png',
          isIncorrect: true,
          respectedProperties: '6,5,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img057.png',
          isIncorrect: false,
          respectedProperties: '4,5,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img058.png',
          isIncorrect: true,
          respectedProperties: '6,5,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img060.png',
          isIncorrect: true,
          respectedProperties: '2,7,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img061.png',
          isIncorrect: true,
          respectedProperties: '6,7,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img062.png',
          isIncorrect: true,
          respectedProperties: '6,7,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img063.png',
          isIncorrect: false,
          respectedProperties: '2,5,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img064.png',
          isIncorrect: true,
          respectedProperties: '6,5,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img065.png',
          isIncorrect: true,
          respectedProperties: '6,5,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img066.png',
          isIncorrect: true,
          respectedProperties: '2,7,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img067.png',
          isIncorrect: true,
          respectedProperties: '6,7,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img068.png',
          isIncorrect: true,
          respectedProperties: '6,7,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img070.png',
          isIncorrect: true,
          respectedProperties: '6,7,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img071.png',
          isIncorrect: true,
          respectedProperties: '6,7,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img072.png',
          isIncorrect: true,
          respectedProperties: '4,7,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img073.png',
          isIncorrect: true,
          respectedProperties: '6,5,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img074.png',
          isIncorrect: true,
          respectedProperties: '6,5,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img075.png',
          isIncorrect: false,
          respectedProperties: '4,5,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img076.png',
          isIncorrect: true,
          respectedProperties: '6,7,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img077.png',
          isIncorrect: true,
          respectedProperties: '6,7,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img078.png',
          isIncorrect: true,
          respectedProperties: '4,7,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img080.png',
          isIncorrect: true,
          respectedProperties: '6,7,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img081.png',
          isIncorrect: true,
          respectedProperties: '4,7,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img082.png',
          isIncorrect: true,
          respectedProperties: '6,7,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img083.png',
          isIncorrect: true,
          respectedProperties: '6,5,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img084.png',
          isIncorrect: false,
          respectedProperties: '4,5,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img085.png',
          isIncorrect: true,
          respectedProperties: '6,5,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img086.png',
          isIncorrect: true,
          respectedProperties: '6,7,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img087.png',
          isIncorrect: true,
          respectedProperties: '4,7,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img088.png',
          isIncorrect: true,
          respectedProperties: '6,7,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img100.png',
          isIncorrect: true,
          respectedProperties: '6,3,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img101.png',
          isIncorrect: true,
          respectedProperties: '6,3,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img102.png',
          isIncorrect: false,
          respectedProperties: '4,3,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img103.png',
          isIncorrect: true,
          respectedProperties: '6,7,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img104.png',
          isIncorrect: true,
          respectedProperties: '6,7,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img105.png',
          isIncorrect: true,
          respectedProperties: '4,7,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img106.png',
          isIncorrect: true,
          respectedProperties: '6,7,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img107.png',
          isIncorrect: true,
          respectedProperties: '6,7,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img108.png',
          isIncorrect: true,
          respectedProperties: '4,7,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img110.png',
          isIncorrect: true,
          respectedProperties: '6,3,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img111.png',
          isIncorrect: false,
          respectedProperties: '2,3,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img112.png',
          isIncorrect: true,
          respectedProperties: '6,3,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img113.png',
          isIncorrect: true,
          respectedProperties: '6,7,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img114.png',
          isIncorrect: true,
          respectedProperties: '2,7,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img115.png',
          isIncorrect: true,
          respectedProperties: '6,7,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img116.png',
          isIncorrect: true,
          respectedProperties: '6,7,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img117.png',
          isIncorrect: true,
          respectedProperties: '2,7,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img118.png',
          isIncorrect: true,
          respectedProperties: '6,7,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img120.png',
          isIncorrect: false,
          respectedProperties: '4,3,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img121.png',
          isIncorrect: true,
          respectedProperties: '6,3,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img122.png',
          isIncorrect: true,
          respectedProperties: '6,3,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img123.png',
          isIncorrect: true,
          respectedProperties: '4,7,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img124.png',
          isIncorrect: true,
          respectedProperties: '6,7,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img125.png',
          isIncorrect: true,
          respectedProperties: '6,7,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img126.png',
          isIncorrect: true,
          respectedProperties: '4,7,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img127.png',
          isIncorrect: true,
          respectedProperties: '6,7,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img128.png',
          isIncorrect: true,
          respectedProperties: '6,7,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img130.png',
          isIncorrect: true,
          respectedProperties: '6,7,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img131.png',
          isIncorrect: true,
          respectedProperties: '6,7,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img132.png',
          isIncorrect: true,
          respectedProperties: '4,7,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img133.png',
          isIncorrect: true,
          respectedProperties: '6,7,0'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img134.png',
          isIncorrect: true,
          respectedProperties: '6,7,0'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img135.png',
          isIncorrect: true,
          respectedProperties: '4,7,0'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img136.png',
          isIncorrect: true,
          respectedProperties: '6,5,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img137.png',
          isIncorrect: true,
          respectedProperties: '6,5,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img138.png',
          isIncorrect: false,
          respectedProperties: '4,5,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img140.png',
          isIncorrect: true,
          respectedProperties: '6,7,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img141.png',
          isIncorrect: true,
          respectedProperties: '2,7,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img142.png',
          isIncorrect: true,
          respectedProperties: '6,7,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img143.png',
          isIncorrect: true,
          respectedProperties: '6,7,0'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img144.png',
          isIncorrect: true,
          respectedProperties: '2,7,0'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img145.png',
          isIncorrect: true,
          respectedProperties: '6,7,0'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img146.png',
          isIncorrect: true,
          respectedProperties: '6,5,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img147.png',
          isIncorrect: false,
          respectedProperties: '2,5,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img148.png',
          isIncorrect: true,
          respectedProperties: '6,5,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img150.png',
          isIncorrect: true,
          respectedProperties: '4,7,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img151.png',
          isIncorrect: true,
          respectedProperties: '6,7,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img152.png',
          isIncorrect: true,
          respectedProperties: '6,7,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img153.png',
          isIncorrect: true,
          respectedProperties: '4,7,0'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img154.png',
          isIncorrect: true,
          respectedProperties: '6,7,0'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img155.png',
          isIncorrect: true,
          respectedProperties: '6,7,0'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img156.png',
          isIncorrect: false,
          respectedProperties: '4,5,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img157.png',
          isIncorrect: true,
          respectedProperties: '6,5,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img158.png',
          isIncorrect: true,
          respectedProperties: '6,5,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img160.png',
          isIncorrect: true,
          respectedProperties: '6,7,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img161.png',
          isIncorrect: true,
          respectedProperties: '6,7,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img162.png',
          isIncorrect: true,
          respectedProperties: '4,7,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img163.png',
          isIncorrect: true,
          respectedProperties: '6,5,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img164.png',
          isIncorrect: true,
          respectedProperties: '6,5,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img165.png',
          isIncorrect: false,
          respectedProperties: '4,5,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img166.png',
          isIncorrect: true,
          respectedProperties: '6,7,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img167.png',
          isIncorrect: true,
          respectedProperties: '6,7,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img168.png',
          isIncorrect: true,
          respectedProperties: '4,7,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img170.png',
          isIncorrect: true,
          respectedProperties: '6,7,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img171.png',
          isIncorrect: true,
          respectedProperties: '2,7,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img172.png',
          isIncorrect: true,
          respectedProperties: '6,7,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img173.png',
          isIncorrect: true,
          respectedProperties: '6,5,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img174.png',
          isIncorrect: false,
          respectedProperties: '2,5,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img175.png',
          isIncorrect: true,
          respectedProperties: '6,5,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img176.png',
          isIncorrect: true,
          respectedProperties: '6,7,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img177.png',
          isIncorrect: true,
          respectedProperties: '2,7,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img178.png',
          isIncorrect: true,
          respectedProperties: '6,7,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img180.png',
          isIncorrect: true,
          respectedProperties: '4,7,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img181.png',
          isIncorrect: true,
          respectedProperties: '6,7,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img182.png',
          isIncorrect: true,
          respectedProperties: '6,7,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img183.png',
          isIncorrect: false,
          respectedProperties: '4,5,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img184.png',
          isIncorrect: true,
          respectedProperties: '6,5,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img185.png',
          isIncorrect: true,
          respectedProperties: '6,5,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img186.png',
          isIncorrect: true,
          respectedProperties: '4,7,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img187.png',
          isIncorrect: true,
          respectedProperties: '6,7,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img188.png',
          isIncorrect: true,
          respectedProperties: '6,7,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img200.png',
          isIncorrect: true,
          respectedProperties: '6,3,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img201.png',
          isIncorrect: false,
          respectedProperties: '4,3,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img202.png',
          isIncorrect: true,
          respectedProperties: '6,3,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img203.png',
          isIncorrect: true,
          respectedProperties: '6,7,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img204.png',
          isIncorrect: true,
          respectedProperties: '4,7,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img205.png',
          isIncorrect: true,
          respectedProperties: '6,7,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img206.png',
          isIncorrect: true,
          respectedProperties: '6,7,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img207.png',
          isIncorrect: true,
          respectedProperties: '4,7,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img208.png',
          isIncorrect: true,
          respectedProperties: '6,7,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img210.png',
          isIncorrect: false,
          respectedProperties: '4,3,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img211.png',
          isIncorrect: true,
          respectedProperties: '6,3,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img212.png',
          isIncorrect: true,
          respectedProperties: '6,3,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img213.png',
          isIncorrect: true,
          respectedProperties: '4,7,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img214.png',
          isIncorrect: true,
          respectedProperties: '6,7,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img215.png',
          isIncorrect: true,
          respectedProperties: '6,7,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img216.png',
          isIncorrect: true,
          respectedProperties: '4,7,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img217.png',
          isIncorrect: true,
          respectedProperties: '6,7,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img218.png',
          isIncorrect: true,
          respectedProperties: '6,7,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img220.png',
          isIncorrect: true,
          respectedProperties: '6,3,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img221.png',
          isIncorrect: true,
          respectedProperties: '6,3,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img222.png',
          isIncorrect: false,
          respectedProperties: '2,3,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img223.png',
          isIncorrect: true,
          respectedProperties: '6,7,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img224.png',
          isIncorrect: true,
          respectedProperties: '6,7,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img225.png',
          isIncorrect: true,
          respectedProperties: '2,7,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img226.png',
          isIncorrect: true,
          respectedProperties: '6,7,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img227.png',
          isIncorrect: true,
          respectedProperties: '6,7,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img228.png',
          isIncorrect: true,
          respectedProperties: '2,7,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img230.png',
          isIncorrect: true,
          respectedProperties: '6,7,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img231.png',
          isIncorrect: true,
          respectedProperties: '4,7,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img232.png',
          isIncorrect: true,
          respectedProperties: '6,7,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img233.png',
          isIncorrect: true,
          respectedProperties: '6,7,0'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img234.png',
          isIncorrect: true,
          respectedProperties: '4,7,0'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img235.png',
          isIncorrect: true,
          respectedProperties: '6,7,0'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img236.png',
          isIncorrect: true,
          respectedProperties: '6,5,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img237.png',
          isIncorrect: false,
          respectedProperties: '4,5,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img238.png',
          isIncorrect: true,
          respectedProperties: '6,5,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img240.png',
          isIncorrect: true,
          respectedProperties: '4,7,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img241.png',
          isIncorrect: true,
          respectedProperties: '6,7,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img242.png',
          isIncorrect: true,
          respectedProperties: '6,7,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img243.png',
          isIncorrect: true,
          respectedProperties: '4,7,0'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img244.png',
          isIncorrect: true,
          respectedProperties: '6,7,0'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img245.png',
          isIncorrect: true,
          respectedProperties: '6,7,0'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img246.png',
          isIncorrect: false,
          respectedProperties: '4,5,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img247.png',
          isIncorrect: true,
          respectedProperties: '6,5,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img248.png',
          isIncorrect: true,
          respectedProperties: '6,5,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img250.png',
          isIncorrect: true,
          respectedProperties: '6,7,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img251.png',
          isIncorrect: true,
          respectedProperties: '6,7,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img252.png',
          isIncorrect: true,
          respectedProperties: '2,7,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img253.png',
          isIncorrect: true,
          respectedProperties: '6,7,0'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img254.png',
          isIncorrect: true,
          respectedProperties: '6,7,0'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img255.png',
          isIncorrect: true,
          respectedProperties: '2,7,0'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img256.png',
          isIncorrect: true,
          respectedProperties: '6,5,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img257.png',
          isIncorrect: true,
          respectedProperties: '6,5,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img258.png',
          isIncorrect: false,
          respectedProperties: '2,5,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img260.png',
          isIncorrect: true,
          respectedProperties: '6,7,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img261.png',
          isIncorrect: true,
          respectedProperties: '4,7,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img262.png',
          isIncorrect: true,
          respectedProperties: '6,7,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img263.png',
          isIncorrect: true,
          respectedProperties: '6,5,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img264.png',
          isIncorrect: false,
          respectedProperties: '4,5,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img265.png',
          isIncorrect: true,
          respectedProperties: '6,5,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img266.png',
          isIncorrect: true,
          respectedProperties: '6,7,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img267.png',
          isIncorrect: true,
          respectedProperties: '4,7,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img268.png',
          isIncorrect: true,
          respectedProperties: '6,7,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img270.png',
          isIncorrect: true,
          respectedProperties: '4,7,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img271.png',
          isIncorrect: true,
          respectedProperties: '6,7,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img272.png',
          isIncorrect: true,
          respectedProperties: '6,7,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img273.png',
          isIncorrect: false,
          respectedProperties: '4,5,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img274.png',
          isIncorrect: true,
          respectedProperties: '6,5,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img275.png',
          isIncorrect: true,
          respectedProperties: '6,5,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img276.png',
          isIncorrect: true,
          respectedProperties: '4,7,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img277.png',
          isIncorrect: true,
          respectedProperties: '6,7,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img278.png',
          isIncorrect: true,
          respectedProperties: '6,7,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img280.png',
          isIncorrect: true,
          respectedProperties: '6,7,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img281.png',
          isIncorrect: true,
          respectedProperties: '6,7,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img282.png',
          isIncorrect: true,
          respectedProperties: '2,7,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img283.png',
          isIncorrect: true,
          respectedProperties: '6,5,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img284.png',
          isIncorrect: true,
          respectedProperties: '6,5,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img285.png',
          isIncorrect: false,
          respectedProperties: '2,5,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img286.png',
          isIncorrect: true,
          respectedProperties: '6,7,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img287.png',
          isIncorrect: true,
          respectedProperties: '6,7,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img288.png',
          isIncorrect: true,
          respectedProperties: '2,7,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img300.png',
          isIncorrect: true,
          respectedProperties: '2,7,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img301.png',
          isIncorrect: true,
          respectedProperties: '6,7,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img302.png',
          isIncorrect: true,
          respectedProperties: '6,7,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img303.png',
          isIncorrect: true,
          respectedProperties: '2,7,0'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img304.png',
          isIncorrect: true,
          respectedProperties: '6,7,0'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img305.png',
          isIncorrect: true,
          respectedProperties: '6,7,0'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img306.png',
          isIncorrect: false,
          respectedProperties: '2,5,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img307.png',
          isIncorrect: true,
          respectedProperties: '6,5,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img308.png',
          isIncorrect: true,
          respectedProperties: '6,5,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img310.png',
          isIncorrect: true,
          respectedProperties: '6,7,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img311.png',
          isIncorrect: true,
          respectedProperties: '6,7,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img312.png',
          isIncorrect: true,
          respectedProperties: '4,7,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img313.png',
          isIncorrect: true,
          respectedProperties: '6,7,0'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img314.png',
          isIncorrect: true,
          respectedProperties: '6,7,0'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img315.png',
          isIncorrect: true,
          respectedProperties: '4,7,0'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img316.png',
          isIncorrect: true,
          respectedProperties: '6,5,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img317.png',
          isIncorrect: true,
          respectedProperties: '6,5,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img318.png',
          isIncorrect: false,
          respectedProperties: '4,5,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img320.png',
          isIncorrect: true,
          respectedProperties: '6,7,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img321.png',
          isIncorrect: true,
          respectedProperties: '4,7,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img322.png',
          isIncorrect: true,
          respectedProperties: '6,7,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img323.png',
          isIncorrect: true,
          respectedProperties: '6,7,0'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img324.png',
          isIncorrect: true,
          respectedProperties: '4,7,0'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img325.png',
          isIncorrect: true,
          respectedProperties: '6,7,0'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img326.png',
          isIncorrect: true,
          respectedProperties: '6,5,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img327.png',
          isIncorrect: false,
          respectedProperties: '4,5,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img328.png',
          isIncorrect: true,
          respectedProperties: '6,5,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img330.png',
          isIncorrect: true,
          respectedProperties: '2,7,0'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img331.png',
          isIncorrect: true,
          respectedProperties: '6,7,0'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img332.png',
          isIncorrect: true,
          respectedProperties: '6,7,0'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img333.png',
          isIncorrect: false,
          respectedProperties: '2,3'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img334.png',
          isIncorrect: true,
          respectedProperties: '6,3'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img335.png',
          isIncorrect: true,
          respectedProperties: '6,3'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img336.png',
          isIncorrect: true,
          respectedProperties: '2,7,0'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img337.png',
          isIncorrect: true,
          respectedProperties: '6,7,0'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img338.png',
          isIncorrect: true,
          respectedProperties: '6,7,0'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img340.png',
          isIncorrect: true,
          respectedProperties: '6,7,0'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img341.png',
          isIncorrect: true,
          respectedProperties: '6,7,0'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img342.png',
          isIncorrect: true,
          respectedProperties: '4,7,0'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img343.png',
          isIncorrect: true,
          respectedProperties: '6,3'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img344.png',
          isIncorrect: true,
          respectedProperties: '6,3'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img345.png',
          isIncorrect: false,
          respectedProperties: '4,3'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img346.png',
          isIncorrect: true,
          respectedProperties: '6,7,0'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img347.png',
          isIncorrect: true,
          respectedProperties: '6,7,0'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img348.png',
          isIncorrect: true,
          respectedProperties: '4,7,0'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img350.png',
          isIncorrect: true,
          respectedProperties: '6,7,0'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img351.png',
          isIncorrect: true,
          respectedProperties: '4,7,0'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img352.png',
          isIncorrect: true,
          respectedProperties: '6,7,0'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img353.png',
          isIncorrect: true,
          respectedProperties: '6,3'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img354.png',
          isIncorrect: false,
          respectedProperties: '4,3'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img355.png',
          isIncorrect: true,
          respectedProperties: '6,3'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img356.png',
          isIncorrect: true,
          respectedProperties: '6,7,0'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img357.png',
          isIncorrect: true,
          respectedProperties: '4,7,0'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img358.png',
          isIncorrect: true,
          respectedProperties: '6,7,0'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img360.png',
          isIncorrect: false,
          respectedProperties: '2,5,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img361.png',
          isIncorrect: true,
          respectedProperties: '6,5,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img362.png',
          isIncorrect: true,
          respectedProperties: '6,5,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img363.png',
          isIncorrect: true,
          respectedProperties: '2,7,0'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img364.png',
          isIncorrect: true,
          respectedProperties: '6,7,0'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img365.png',
          isIncorrect: true,
          respectedProperties: '6,7,0'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img366.png',
          isIncorrect: true,
          respectedProperties: '2,7,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img367.png',
          isIncorrect: true,
          respectedProperties: '6,7,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img368.png',
          isIncorrect: true,
          respectedProperties: '6,7,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img370.png',
          isIncorrect: true,
          respectedProperties: '6,5,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img371.png',
          isIncorrect: true,
          respectedProperties: '6,5,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img372.png',
          isIncorrect: false,
          respectedProperties: '4,5,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img373.png',
          isIncorrect: true,
          respectedProperties: '6,7,0'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img374.png',
          isIncorrect: true,
          respectedProperties: '6,7,0'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img375.png',
          isIncorrect: true,
          respectedProperties: '4,7,0'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img376.png',
          isIncorrect: true,
          respectedProperties: '6,7,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img377.png',
          isIncorrect: true,
          respectedProperties: '6,7,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img378.png',
          isIncorrect: true,
          respectedProperties: '4,7,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img380.png',
          isIncorrect: true,
          respectedProperties: '6,5,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img381.png',
          isIncorrect: false,
          respectedProperties: '4,5,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img382.png',
          isIncorrect: true,
          respectedProperties: '6,5,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img383.png',
          isIncorrect: true,
          respectedProperties: '6,7,0'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img384.png',
          isIncorrect: true,
          respectedProperties: '4,7,0'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img385.png',
          isIncorrect: true,
          respectedProperties: '6,7,0'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img386.png',
          isIncorrect: true,
          respectedProperties: '6,7,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img387.png',
          isIncorrect: true,
          respectedProperties: '4,7,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img388.png',
          isIncorrect: true,
          respectedProperties: '6,7,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img400.png',
          isIncorrect: true,
          respectedProperties: '6,7,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img401.png',
          isIncorrect: true,
          respectedProperties: '6,7,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img402.png',
          isIncorrect: true,
          respectedProperties: '4,7,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img403.png',
          isIncorrect: true,
          respectedProperties: '6,7,0'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img404.png',
          isIncorrect: true,
          respectedProperties: '6,7,0'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img405.png',
          isIncorrect: true,
          respectedProperties: '4,7,0'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img406.png',
          isIncorrect: true,
          respectedProperties: '6,5,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img407.png',
          isIncorrect: true,
          respectedProperties: '6,5,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img408.png',
          isIncorrect: false,
          respectedProperties: '4,5,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img410.png',
          isIncorrect: true,
          respectedProperties: '6,7,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img411.png',
          isIncorrect: true,
          respectedProperties: '2,7,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img412.png',
          isIncorrect: true,
          respectedProperties: '6,7,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img413.png',
          isIncorrect: true,
          respectedProperties: '6,7,0'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img414.png',
          isIncorrect: true,
          respectedProperties: '2,7,0'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img415.png',
          isIncorrect: true,
          respectedProperties: '6,7,0'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img416.png',
          isIncorrect: true,
          respectedProperties: '6,5,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img417.png',
          isIncorrect: false,
          respectedProperties: '2,5,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img418.png',
          isIncorrect: true,
          respectedProperties: '6,5,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img420.png',
          isIncorrect: true,
          respectedProperties: '4,7,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img421.png',
          isIncorrect: true,
          respectedProperties: '6,7,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img422.png',
          isIncorrect: true,
          respectedProperties: '6,7,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img423.png',
          isIncorrect: true,
          respectedProperties: '4,7,0'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img424.png',
          isIncorrect: true,
          respectedProperties: '6,7,0'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img425.png',
          isIncorrect: true,
          respectedProperties: '6,7,0'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img426.png',
          isIncorrect: false,
          respectedProperties: '4,5,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img427.png',
          isIncorrect: true,
          respectedProperties: '6,5,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img428.png',
          isIncorrect: true,
          respectedProperties: '6,5,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img430.png',
          isIncorrect: true,
          respectedProperties: '6,7,0'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img431.png',
          isIncorrect: true,
          respectedProperties: '6,7,0'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img432.png',
          isIncorrect: true,
          respectedProperties: '4,7,0'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img433.png',
          isIncorrect: true,
          respectedProperties: '6,3'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img434.png',
          isIncorrect: true,
          respectedProperties: '6,3'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img435.png',
          isIncorrect: false,
          respectedProperties: '4,3'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img436.png',
          isIncorrect: true,
          respectedProperties: '6,7,0'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img437.png',
          isIncorrect: true,
          respectedProperties: '6,7,0'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img438.png',
          isIncorrect: true,
          respectedProperties: '4,7,0'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img440.png',
          isIncorrect: true,
          respectedProperties: '6,7,0'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img441.png',
          isIncorrect: true,
          respectedProperties: '2,7,0'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img442.png',
          isIncorrect: true,
          respectedProperties: '6,7,0'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img443.png',
          isIncorrect: true,
          respectedProperties: '6,3'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img444.png',
          isIncorrect: false,
          respectedProperties: '2,3'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img445.png',
          isIncorrect: true,
          respectedProperties: '6,3'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img446.png',
          isIncorrect: true,
          respectedProperties: '6,7,0'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img447.png',
          isIncorrect: true,
          respectedProperties: '2,7,0'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img448.png',
          isIncorrect: true,
          respectedProperties: '6,7,0'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img450.png',
          isIncorrect: true,
          respectedProperties: '4,7,0'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img451.png',
          isIncorrect: true,
          respectedProperties: '6,7,0'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img452.png',
          isIncorrect: true,
          respectedProperties: '6,7,0'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img453.png',
          isIncorrect: false,
          respectedProperties: '4,3'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img454.png',
          isIncorrect: true,
          respectedProperties: '6,3'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img455.png',
          isIncorrect: true,
          respectedProperties: '6,3'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img456.png',
          isIncorrect: true,
          respectedProperties: '4,7,0'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img457.png',
          isIncorrect: true,
          respectedProperties: '6,7,0'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img458.png',
          isIncorrect: true,
          respectedProperties: '6,7,0'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img460.png',
          isIncorrect: true,
          respectedProperties: '6,5,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img461.png',
          isIncorrect: true,
          respectedProperties: '6,5,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img462.png',
          isIncorrect: false,
          respectedProperties: '4,5,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img463.png',
          isIncorrect: true,
          respectedProperties: '6,7,0'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img464.png',
          isIncorrect: true,
          respectedProperties: '6,7,0'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img465.png',
          isIncorrect: true,
          respectedProperties: '4,7,0'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img466.png',
          isIncorrect: true,
          respectedProperties: '6,7,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img467.png',
          isIncorrect: true,
          respectedProperties: '6,7,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img468.png',
          isIncorrect: true,
          respectedProperties: '4,7,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img470.png',
          isIncorrect: true,
          respectedProperties: '6,5,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img471.png',
          isIncorrect: false,
          respectedProperties: '2,5,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img472.png',
          isIncorrect: true,
          respectedProperties: '6,5,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img473.png',
          isIncorrect: true,
          respectedProperties: '6,7,0'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img474.png',
          isIncorrect: true,
          respectedProperties: '2,7,0'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img475.png',
          isIncorrect: true,
          respectedProperties: '6,7,0'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img476.png',
          isIncorrect: true,
          respectedProperties: '6,7,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img477.png',
          isIncorrect: true,
          respectedProperties: '2,7,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img478.png',
          isIncorrect: true,
          respectedProperties: '6,7,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img480.png',
          isIncorrect: false,
          respectedProperties: '4,5,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img481.png',
          isIncorrect: true,
          respectedProperties: '6,5,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img482.png',
          isIncorrect: true,
          respectedProperties: '6,5,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img483.png',
          isIncorrect: true,
          respectedProperties: '4,7,0'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img484.png',
          isIncorrect: true,
          respectedProperties: '6,7,0'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img485.png',
          isIncorrect: true,
          respectedProperties: '6,7,0'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img486.png',
          isIncorrect: true,
          respectedProperties: '4,7,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img487.png',
          isIncorrect: true,
          respectedProperties: '6,7,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img488.png',
          isIncorrect: true,
          respectedProperties: '6,7,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img500.png',
          isIncorrect: true,
          respectedProperties: '6,7,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img501.png',
          isIncorrect: true,
          respectedProperties: '4,7,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img502.png',
          isIncorrect: true,
          respectedProperties: '6,7,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img503.png',
          isIncorrect: true,
          respectedProperties: '6,7,0'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img504.png',
          isIncorrect: true,
          respectedProperties: '4,7,0'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img505.png',
          isIncorrect: true,
          respectedProperties: '6,7,0'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img506.png',
          isIncorrect: true,
          respectedProperties: '6,5,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img507.png',
          isIncorrect: false,
          respectedProperties: '4,5,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img508.png',
          isIncorrect: true,
          respectedProperties: '6,5,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img510.png',
          isIncorrect: true,
          respectedProperties: '4,7,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img511.png',
          isIncorrect: true,
          respectedProperties: '6,7,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img512.png',
          isIncorrect: true,
          respectedProperties: '6,7,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img513.png',
          isIncorrect: true,
          respectedProperties: '4,7,0'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img514.png',
          isIncorrect: true,
          respectedProperties: '6,7,0'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img515.png',
          isIncorrect: true,
          respectedProperties: '6,7,0'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img516.png',
          isIncorrect: false,
          respectedProperties: '4,5,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img517.png',
          isIncorrect: true,
          respectedProperties: '6,5,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img518.png',
          isIncorrect: true,
          respectedProperties: '6,5,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img520.png',
          isIncorrect: true,
          respectedProperties: '6,7,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img521.png',
          isIncorrect: true,
          respectedProperties: '6,7,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img522.png',
          isIncorrect: true,
          respectedProperties: '2,7,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img523.png',
          isIncorrect: true,
          respectedProperties: '6,7,0'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img524.png',
          isIncorrect: true,
          respectedProperties: '6,7,0'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img525.png',
          isIncorrect: true,
          respectedProperties: '2,7,0'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img526.png',
          isIncorrect: true,
          respectedProperties: '6,5,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img527.png',
          isIncorrect: true,
          respectedProperties: '6,5,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img528.png',
          isIncorrect: false,
          respectedProperties: '2,5,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img530.png',
          isIncorrect: true,
          respectedProperties: '6,7,0'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img531.png',
          isIncorrect: true,
          respectedProperties: '4,7,0'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img532.png',
          isIncorrect: true,
          respectedProperties: '6,7,0'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img533.png',
          isIncorrect: true,
          respectedProperties: '6,3'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img534.png',
          isIncorrect: false,
          respectedProperties: '4,3'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img535.png',
          isIncorrect: true,
          respectedProperties: '6,3'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img536.png',
          isIncorrect: true,
          respectedProperties: '6,7,0'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img537.png',
          isIncorrect: true,
          respectedProperties: '4,7,0'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img538.png',
          isIncorrect: true,
          respectedProperties: '6,7,0'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img540.png',
          isIncorrect: true,
          respectedProperties: '4,7,0'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img541.png',
          isIncorrect: true,
          respectedProperties: '6,7,0'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img542.png',
          isIncorrect: true,
          respectedProperties: '6,7,0'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img543.png',
          isIncorrect: false,
          respectedProperties: '4,3'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img544.png',
          isIncorrect: true,
          respectedProperties: '6,3'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img545.png',
          isIncorrect: true,
          respectedProperties: '6,3'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img546.png',
          isIncorrect: true,
          respectedProperties: '4,7,0'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img547.png',
          isIncorrect: true,
          respectedProperties: '6,7,0'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img548.png',
          isIncorrect: true,
          respectedProperties: '6,7,0'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img550.png',
          isIncorrect: true,
          respectedProperties: '6,7,0'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img551.png',
          isIncorrect: true,
          respectedProperties: '6,7,0'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img552.png',
          isIncorrect: true,
          respectedProperties: '2,7,0'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img553.png',
          isIncorrect: true,
          respectedProperties: '6,3'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img554.png',
          isIncorrect: true,
          respectedProperties: '6,3'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img555.png',
          isIncorrect: false,
          respectedProperties: '2,3'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img556.png',
          isIncorrect: true,
          respectedProperties: '6,7,0'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img557.png',
          isIncorrect: true,
          respectedProperties: '6,7,0'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img558.png',
          isIncorrect: true,
          respectedProperties: '2,7,0'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img560.png',
          isIncorrect: true,
          respectedProperties: '6,5,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img561.png',
          isIncorrect: false,
          respectedProperties: '4,5,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img562.png',
          isIncorrect: true,
          respectedProperties: '6,5,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img563.png',
          isIncorrect: true,
          respectedProperties: '6,7,0'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img564.png',
          isIncorrect: true,
          respectedProperties: '4,7,0'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img565.png',
          isIncorrect: true,
          respectedProperties: '6,7,0'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img566.png',
          isIncorrect: true,
          respectedProperties: '6,7,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img567.png',
          isIncorrect: true,
          respectedProperties: '4,7,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img568.png',
          isIncorrect: true,
          respectedProperties: '6,7,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img570.png',
          isIncorrect: false,
          respectedProperties: '4,5,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img571.png',
          isIncorrect: true,
          respectedProperties: '6,5,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img572.png',
          isIncorrect: true,
          respectedProperties: '6,5,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img573.png',
          isIncorrect: true,
          respectedProperties: '4,7,0'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img574.png',
          isIncorrect: true,
          respectedProperties: '6,7,0'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img575.png',
          isIncorrect: true,
          respectedProperties: '6,7,0'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img576.png',
          isIncorrect: true,
          respectedProperties: '4,7,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img577.png',
          isIncorrect: true,
          respectedProperties: '6,7,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img578.png',
          isIncorrect: true,
          respectedProperties: '6,7,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img580.png',
          isIncorrect: true,
          respectedProperties: '6,5,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img581.png',
          isIncorrect: true,
          respectedProperties: '6,5,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img582.png',
          isIncorrect: false,
          respectedProperties: '2,5,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img583.png',
          isIncorrect: true,
          respectedProperties: '6,7,0'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img584.png',
          isIncorrect: true,
          respectedProperties: '6,7,0'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img585.png',
          isIncorrect: true,
          respectedProperties: '2,7,0'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img586.png',
          isIncorrect: true,
          respectedProperties: '6,7,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img587.png',
          isIncorrect: true,
          respectedProperties: '6,7,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img588.png',
          isIncorrect: true,
          respectedProperties: '2,7,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img600.png',
          isIncorrect: true,
          respectedProperties: '2,7,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img601.png',
          isIncorrect: true,
          respectedProperties: '6,7,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img602.png',
          isIncorrect: true,
          respectedProperties: '6,7,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img603.png',
          isIncorrect: false,
          respectedProperties: '2,5,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img604.png',
          isIncorrect: true,
          respectedProperties: '6,5,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img605.png',
          isIncorrect: true,
          respectedProperties: '6,5,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img606.png',
          isIncorrect: true,
          respectedProperties: '2,7,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img607.png',
          isIncorrect: true,
          respectedProperties: '6,7,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img608.png',
          isIncorrect: true,
          respectedProperties: '6,7,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img610.png',
          isIncorrect: true,
          respectedProperties: '6,7,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img611.png',
          isIncorrect: true,
          respectedProperties: '6,7,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img612.png',
          isIncorrect: true,
          respectedProperties: '4,7,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img613.png',
          isIncorrect: true,
          respectedProperties: '6,5,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img614.png',
          isIncorrect: true,
          respectedProperties: '6,5,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img615.png',
          isIncorrect: false,
          respectedProperties: '4,5,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img616.png',
          isIncorrect: true,
          respectedProperties: '6,7,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img617.png',
          isIncorrect: true,
          respectedProperties: '6,7,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img618.png',
          isIncorrect: true,
          respectedProperties: '4,7,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img620.png',
          isIncorrect: true,
          respectedProperties: '6,7,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img621.png',
          isIncorrect: true,
          respectedProperties: '4,7,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img622.png',
          isIncorrect: true,
          respectedProperties: '6,7,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img623.png',
          isIncorrect: true,
          respectedProperties: '6,5,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img624.png',
          isIncorrect: false,
          respectedProperties: '4,5,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img625.png',
          isIncorrect: true,
          respectedProperties: '6,5,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img626.png',
          isIncorrect: true,
          respectedProperties: '6,7,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img627.png',
          isIncorrect: true,
          respectedProperties: '4,7,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img628.png',
          isIncorrect: true,
          respectedProperties: '6,7,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img630.png',
          isIncorrect: false,
          respectedProperties: '2,5,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img631.png',
          isIncorrect: true,
          respectedProperties: '6,5,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img632.png',
          isIncorrect: true,
          respectedProperties: '6,5,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img633.png',
          isIncorrect: true,
          respectedProperties: '2,7,0'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img634.png',
          isIncorrect: true,
          respectedProperties: '6,7,0'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img635.png',
          isIncorrect: true,
          respectedProperties: '6,7,0'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img636.png',
          isIncorrect: true,
          respectedProperties: '2,7,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img637.png',
          isIncorrect: true,
          respectedProperties: '6,7,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img638.png',
          isIncorrect: true,
          respectedProperties: '6,7,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img640.png',
          isIncorrect: true,
          respectedProperties: '6,5,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img641.png',
          isIncorrect: true,
          respectedProperties: '6,5,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img642.png',
          isIncorrect: false,
          respectedProperties: '4,5,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img643.png',
          isIncorrect: true,
          respectedProperties: '6,7,0'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img644.png',
          isIncorrect: true,
          respectedProperties: '6,7,0'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img645.png',
          isIncorrect: true,
          respectedProperties: '4,7,0'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img646.png',
          isIncorrect: true,
          respectedProperties: '6,7,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img647.png',
          isIncorrect: true,
          respectedProperties: '6,7,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img648.png',
          isIncorrect: true,
          respectedProperties: '4,7,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img650.png',
          isIncorrect: true,
          respectedProperties: '6,5,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img651.png',
          isIncorrect: false,
          respectedProperties: '4,5,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img652.png',
          isIncorrect: true,
          respectedProperties: '6,5,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img653.png',
          isIncorrect: true,
          respectedProperties: '6,7,0'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img654.png',
          isIncorrect: true,
          respectedProperties: '4,7,0'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img655.png',
          isIncorrect: true,
          respectedProperties: '6,7,0'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img656.png',
          isIncorrect: true,
          respectedProperties: '6,7,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img657.png',
          isIncorrect: true,
          respectedProperties: '4,7,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img658.png',
          isIncorrect: true,
          respectedProperties: '6,7,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img660.png',
          isIncorrect: true,
          respectedProperties: '2,7,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img661.png',
          isIncorrect: true,
          respectedProperties: '6,7,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img662.png',
          isIncorrect: true,
          respectedProperties: '6,7,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img663.png',
          isIncorrect: true,
          respectedProperties: '2,7,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img664.png',
          isIncorrect: true,
          respectedProperties: '6,7,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img665.png',
          isIncorrect: true,
          respectedProperties: '6,7,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img666.png',
          isIncorrect: false,
          respectedProperties: '2,3,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img667.png',
          isIncorrect: true,
          respectedProperties: '6,3,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img668.png',
          isIncorrect: true,
          respectedProperties: '6,3,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img670.png',
          isIncorrect: true,
          respectedProperties: '6,7,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img671.png',
          isIncorrect: true,
          respectedProperties: '6,7,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img672.png',
          isIncorrect: true,
          respectedProperties: '4,7,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img673.png',
          isIncorrect: true,
          respectedProperties: '6,7,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img674.png',
          isIncorrect: true,
          respectedProperties: '6,7,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img675.png',
          isIncorrect: true,
          respectedProperties: '4,7,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img676.png',
          isIncorrect: true,
          respectedProperties: '6,3,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img677.png',
          isIncorrect: true,
          respectedProperties: '6,3,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img678.png',
          isIncorrect: false,
          respectedProperties: '4,3,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img680.png',
          isIncorrect: true,
          respectedProperties: '6,7,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img681.png',
          isIncorrect: true,
          respectedProperties: '4,7,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img682.png',
          isIncorrect: true,
          respectedProperties: '6,7,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img683.png',
          isIncorrect: true,
          respectedProperties: '6,7,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img684.png',
          isIncorrect: true,
          respectedProperties: '4,7,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img685.png',
          isIncorrect: true,
          respectedProperties: '6,7,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img686.png',
          isIncorrect: true,
          respectedProperties: '6,3,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img687.png',
          isIncorrect: false,
          respectedProperties: '4,3,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img688.png',
          isIncorrect: true,
          respectedProperties: '6,3,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img700.png',
          isIncorrect: true,
          respectedProperties: '6,7,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img701.png',
          isIncorrect: true,
          respectedProperties: '6,7,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img702.png',
          isIncorrect: true,
          respectedProperties: '4,7,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img703.png',
          isIncorrect: true,
          respectedProperties: '6,5,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img704.png',
          isIncorrect: true,
          respectedProperties: '6,5,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img705.png',
          isIncorrect: false,
          respectedProperties: '4,5,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img706.png',
          isIncorrect: true,
          respectedProperties: '6,7,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img707.png',
          isIncorrect: true,
          respectedProperties: '6,7,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img708.png',
          isIncorrect: true,
          respectedProperties: '4,7,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img710.png',
          isIncorrect: true,
          respectedProperties: '6,7,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img711.png',
          isIncorrect: true,
          respectedProperties: '2,7,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img712.png',
          isIncorrect: true,
          respectedProperties: '6,7,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img713.png',
          isIncorrect: true,
          respectedProperties: '6,5,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img714.png',
          isIncorrect: false,
          respectedProperties: '2,5,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img715.png',
          isIncorrect: true,
          respectedProperties: '6,5,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img716.png',
          isIncorrect: true,
          respectedProperties: '6,7,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img717.png',
          isIncorrect: true,
          respectedProperties: '2,7,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img718.png',
          isIncorrect: true,
          respectedProperties: '6,7,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img720.png',
          isIncorrect: true,
          respectedProperties: '4,7,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img721.png',
          isIncorrect: true,
          respectedProperties: '6,7,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img722.png',
          isIncorrect: true,
          respectedProperties: '6,7,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img723.png',
          isIncorrect: false,
          respectedProperties: '4,5,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img724.png',
          isIncorrect: true,
          respectedProperties: '6,5,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img725.png',
          isIncorrect: true,
          respectedProperties: '6,5,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img726.png',
          isIncorrect: true,
          respectedProperties: '4,7,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img727.png',
          isIncorrect: true,
          respectedProperties: '6,7,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img728.png',
          isIncorrect: true,
          respectedProperties: '6,7,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img730.png',
          isIncorrect: true,
          respectedProperties: '6,5,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img731.png',
          isIncorrect: true,
          respectedProperties: '6,5,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img732.png',
          isIncorrect: false,
          respectedProperties: '4,5,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img733.png',
          isIncorrect: true,
          respectedProperties: '6,7,0'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img734.png',
          isIncorrect: true,
          respectedProperties: '6,7,0'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img735.png',
          isIncorrect: true,
          respectedProperties: '4,7,0'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img736.png',
          isIncorrect: true,
          respectedProperties: '6,7,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img737.png',
          isIncorrect: true,
          respectedProperties: '6,7,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img738.png',
          isIncorrect: true,
          respectedProperties: '4,7,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img740.png',
          isIncorrect: true,
          respectedProperties: '6,5,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img741.png',
          isIncorrect: false,
          respectedProperties: '2,5,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img742.png',
          isIncorrect: true,
          respectedProperties: '6,5,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img743.png',
          isIncorrect: true,
          respectedProperties: '6,7,0'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img744.png',
          isIncorrect: true,
          respectedProperties: '2,7,0'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img745.png',
          isIncorrect: true,
          respectedProperties: '6,7,0'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img746.png',
          isIncorrect: true,
          respectedProperties: '6,7,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img747.png',
          isIncorrect: true,
          respectedProperties: '2,7,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img748.png',
          isIncorrect: true,
          respectedProperties: '6,7,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img750.png',
          isIncorrect: false,
          respectedProperties: '4,5,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img751.png',
          isIncorrect: true,
          respectedProperties: '6,5,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img752.png',
          isIncorrect: true,
          respectedProperties: '6,5,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img753.png',
          isIncorrect: true,
          respectedProperties: '4,7,0'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img754.png',
          isIncorrect: true,
          respectedProperties: '6,7,0'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img755.png',
          isIncorrect: true,
          respectedProperties: '6,7,0'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img756.png',
          isIncorrect: true,
          respectedProperties: '4,7,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img757.png',
          isIncorrect: true,
          respectedProperties: '6,7,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img758.png',
          isIncorrect: true,
          respectedProperties: '6,7,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img760.png',
          isIncorrect: true,
          respectedProperties: '6,7,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img761.png',
          isIncorrect: true,
          respectedProperties: '6,7,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img762.png',
          isIncorrect: true,
          respectedProperties: '4,7,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img763.png',
          isIncorrect: true,
          respectedProperties: '6,7,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img764.png',
          isIncorrect: true,
          respectedProperties: '6,7,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img765.png',
          isIncorrect: true,
          respectedProperties: '4,7,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img766.png',
          isIncorrect: true,
          respectedProperties: '6,3,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img767.png',
          isIncorrect: true,
          respectedProperties: '6,3,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img768.png',
          isIncorrect: false,
          respectedProperties: '4,3,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img770.png',
          isIncorrect: true,
          respectedProperties: '6,7,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img771.png',
          isIncorrect: true,
          respectedProperties: '2,7,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img772.png',
          isIncorrect: true,
          respectedProperties: '6,7,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img773.png',
          isIncorrect: true,
          respectedProperties: '6,7,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img774.png',
          isIncorrect: true,
          respectedProperties: '2,7,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img775.png',
          isIncorrect: true,
          respectedProperties: '6,7,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img776.png',
          isIncorrect: true,
          respectedProperties: '6,3,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img777.png',
          isIncorrect: false,
          respectedProperties: '2,3,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img778.png',
          isIncorrect: true,
          respectedProperties: '6,3,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img780.png',
          isIncorrect: true,
          respectedProperties: '4,7,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img781.png',
          isIncorrect: true,
          respectedProperties: '6,7,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img782.png',
          isIncorrect: true,
          respectedProperties: '6,7,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img783.png',
          isIncorrect: true,
          respectedProperties: '4,7,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img784.png',
          isIncorrect: true,
          respectedProperties: '6,7,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img785.png',
          isIncorrect: true,
          respectedProperties: '6,7,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img786.png',
          isIncorrect: false,
          respectedProperties: '4,3,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img787.png',
          isIncorrect: true,
          respectedProperties: '6,3,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img788.png',
          isIncorrect: true,
          respectedProperties: '6,3,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img800.png',
          isIncorrect: true,
          respectedProperties: '6,7,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img801.png',
          isIncorrect: true,
          respectedProperties: '4,7,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img802.png',
          isIncorrect: true,
          respectedProperties: '6,7,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img803.png',
          isIncorrect: true,
          respectedProperties: '6,5,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img804.png',
          isIncorrect: false,
          respectedProperties: '4,5,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img805.png',
          isIncorrect: true,
          respectedProperties: '6,5,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img806.png',
          isIncorrect: true,
          respectedProperties: '6,7,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img807.png',
          isIncorrect: true,
          respectedProperties: '4,7,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img808.png',
          isIncorrect: true,
          respectedProperties: '6,7,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img810.png',
          isIncorrect: true,
          respectedProperties: '4,7,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img811.png',
          isIncorrect: true,
          respectedProperties: '6,7,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img812.png',
          isIncorrect: true,
          respectedProperties: '6,7,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img813.png',
          isIncorrect: false,
          respectedProperties: '4,5,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img814.png',
          isIncorrect: true,
          respectedProperties: '6,5,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img815.png',
          isIncorrect: true,
          respectedProperties: '6,5,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img816.png',
          isIncorrect: true,
          respectedProperties: '4,7,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img817.png',
          isIncorrect: true,
          respectedProperties: '6,7,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img818.png',
          isIncorrect: true,
          respectedProperties: '6,7,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img820.png',
          isIncorrect: true,
          respectedProperties: '6,7,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img821.png',
          isIncorrect: true,
          respectedProperties: '6,7,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img822.png',
          isIncorrect: true,
          respectedProperties: '2,7,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img823.png',
          isIncorrect: true,
          respectedProperties: '6,5,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img824.png',
          isIncorrect: true,
          respectedProperties: '6,5,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img825.png',
          isIncorrect: false,
          respectedProperties: '2,5,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img826.png',
          isIncorrect: true,
          respectedProperties: '6,7,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img827.png',
          isIncorrect: true,
          respectedProperties: '6,7,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img828.png',
          isIncorrect: true,
          respectedProperties: '2,7,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img830.png',
          isIncorrect: true,
          respectedProperties: '6,5,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img831.png',
          isIncorrect: false,
          respectedProperties: '4,5,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img832.png',
          isIncorrect: true,
          respectedProperties: '6,5,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img833.png',
          isIncorrect: true,
          respectedProperties: '6,7,0'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img834.png',
          isIncorrect: true,
          respectedProperties: '4,7,0'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img835.png',
          isIncorrect: true,
          respectedProperties: '6,7,0'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img836.png',
          isIncorrect: true,
          respectedProperties: '6,7,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img837.png',
          isIncorrect: true,
          respectedProperties: '4,7,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img838.png',
          isIncorrect: true,
          respectedProperties: '6,7,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img840.png',
          isIncorrect: false,
          respectedProperties: '4,5,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img841.png',
          isIncorrect: true,
          respectedProperties: '6,5,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img842.png',
          isIncorrect: true,
          respectedProperties: '6,5,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img843.png',
          isIncorrect: true,
          respectedProperties: '4,7,0'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img844.png',
          isIncorrect: true,
          respectedProperties: '6,7,0'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img845.png',
          isIncorrect: true,
          respectedProperties: '6,7,0'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img846.png',
          isIncorrect: true,
          respectedProperties: '4,7,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img847.png',
          isIncorrect: true,
          respectedProperties: '6,7,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img848.png',
          isIncorrect: true,
          respectedProperties: '6,7,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img850.png',
          isIncorrect: true,
          respectedProperties: '6,5,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img851.png',
          isIncorrect: true,
          respectedProperties: '6,5,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img852.png',
          isIncorrect: false,
          respectedProperties: '2,5,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img853.png',
          isIncorrect: true,
          respectedProperties: '6,7,0'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img854.png',
          isIncorrect: true,
          respectedProperties: '6,7,0'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img855.png',
          isIncorrect: true,
          respectedProperties: '2,7,0'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img856.png',
          isIncorrect: true,
          respectedProperties: '6,7,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img857.png',
          isIncorrect: true,
          respectedProperties: '6,7,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img858.png',
          isIncorrect: true,
          respectedProperties: '2,7,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img860.png',
          isIncorrect: true,
          respectedProperties: '6,7,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img861.png',
          isIncorrect: true,
          respectedProperties: '4,7,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img862.png',
          isIncorrect: true,
          respectedProperties: '6,7,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img863.png',
          isIncorrect: true,
          respectedProperties: '6,7,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img864.png',
          isIncorrect: true,
          respectedProperties: '4,7,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img865.png',
          isIncorrect: true,
          respectedProperties: '6,7,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img866.png',
          isIncorrect: true,
          respectedProperties: '6,3,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img867.png',
          isIncorrect: false,
          respectedProperties: '4,3,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img868.png',
          isIncorrect: true,
          respectedProperties: '6,3,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img870.png',
          isIncorrect: true,
          respectedProperties: '4,7,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img871.png',
          isIncorrect: true,
          respectedProperties: '6,7,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img872.png',
          isIncorrect: true,
          respectedProperties: '6,7,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img873.png',
          isIncorrect: true,
          respectedProperties: '4,7,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img874.png',
          isIncorrect: true,
          respectedProperties: '6,7,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img875.png',
          isIncorrect: true,
          respectedProperties: '6,7,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img876.png',
          isIncorrect: false,
          respectedProperties: '4,3,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img877.png',
          isIncorrect: true,
          respectedProperties: '6,3,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img878.png',
          isIncorrect: true,
          respectedProperties: '6,3,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img880.png',
          isIncorrect: true,
          respectedProperties: '6,7,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img881.png',
          isIncorrect: true,
          respectedProperties: '6,7,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img882.png',
          isIncorrect: true,
          respectedProperties: '2,7,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img883.png',
          isIncorrect: true,
          respectedProperties: '6,7,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img884.png',
          isIncorrect: true,
          respectedProperties: '6,7,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img885.png',
          isIncorrect: true,
          respectedProperties: '2,7,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img886.png',
          isIncorrect: true,
          respectedProperties: '6,3,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img887.png',
          isIncorrect: true,
          respectedProperties: '6,3,0,1'
        },
        {
          url:
            'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img888.png',
          isIncorrect: false,
          respectedProperties: '2,3,0,1'
        }
      ]
    },
    data: []
  }
];
