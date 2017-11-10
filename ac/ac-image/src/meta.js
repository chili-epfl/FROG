export const meta = {
  name: 'Image viewer',
  type: 'react-component',
  shortDesc: 'Display images',
  description: 'Display a list of images possibly categorised',
  exampleData: [
    {
      title: 'Simple view',
      config: {
        minVote: 1,
        images: [
          {
            url: 'https://wpclipart.com/space/moon/moon_2/moon_photo.jpg'
          },
          {
            url: 'https://wpclipart.com/space/meteor/bolide.png'
          },
          {
            url: 'https://wpclipart.com/space/solar_system/Earth/earth_4.png'
          },
          {
            url:
              'https://wpclipart.com/space/solar_system/sun/solar_eclipse/solar_eclipse_corona.jpg'
          },
          {
            url:
              'https://wpclipart.com/space/solar_system/sun/sun_prominence.jpg'
          }
        ]
      },
      data: {}
    },
    {
      title: 'With uploads',
      config: {
        canUpload: true,
        guidelines:
          'Ajoutez des images ou bien prenez une photo avec votre webcam'
      },
      data: {}
    },
    {
      title: 'With categories',
      config: {
        guidelines: 'Look at categories of image',
        images: [
          {
            url: 'https://wpclipart.com/space/moon/moon_2/moon_photo.jpg',
            categories: ['moon', 'solar system']
          },
          {
            url: 'https://wpclipart.com/space/meteor/bolide.png',
            categories: ['meteor']
          },
          {
            url: 'https://wpclipart.com/space/solar_system/Earth/earth_4.png',
            categories: ['earth', 'solar system']
          },
          {
            url:
              'https://wpclipart.com/space/solar_system/sun/solar_eclipse/solar_eclipse_corona.jpg',
            categories: ['sun', 'moon', 'solar system']
          },
          {
            url:
              'https://wpclipart.com/space/solar_system/sun/sun_prominence.jpg',
            categories: ['sun', 'solar system']
          }
        ]
      },
      data: {}
    },
    {
      title: 'With votes',
      config: {
        guidelines: 'Votez pour les images les plus interessantes',
        canVote: true,
        minVote: 2,
        images: [
          {
            url: 'https://wpclipart.com/space/moon/moon_2/moon_photo.jpg'
          },
          {
            url: 'https://wpclipart.com/space/meteor/bolide.png'
          },
          {
            url: 'https://wpclipart.com/space/solar_system/Earth/earth_4.png'
          },
          {
            url:
              'https://wpclipart.com/space/solar_system/sun/solar_eclipse/solar_eclipse_corona.jpg'
          },
          {
            url:
              'https://wpclipart.com/space/solar_system/sun/sun_prominence.jpg'
          }
        ]
      },
      data: {}
    }
  ]
};
