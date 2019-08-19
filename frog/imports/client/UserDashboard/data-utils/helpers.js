import {
    Bookmark,
    Bookmarks,
    ShowChart,
    Share,
    Forward,
    Delete,
    PlayArrow,
    Create
  } from '@material-ui/icons';

  export const parseDate = date => {
      return date.getDate() + "/" + (date.getMonth() + 1).toString + "/" + date.getFullYear(); 

  }

  const parseEpocDate = epoc => {
      const date = new Date(epoc); 
      return parseDate(date); 
  }

  const getSessionIcon = session => {
     if (session.singleActivity)
     return Bookmark
     else if (session.template)
     return Bookmarks; 
     else
     return ShowChart
  }

  const getSessionStatus = session => {
      if (session.status === 'READY')
      return "Ready";
      else if (session.status === 'PAUSED')
      return "Paused"; 
      else if (session.status === "STARTED")
      return "Running"; 
      else if (session.status === "FINISHED")
      return "Complete";
      
  }

  const getSessionTypeInfo = session  => {
      if (session.singleActivity)
      return "Single Activity: " + session.name + "  | Slug: " + session.slug; 
      else if (session.template)
      return "Template : " + session.name + "  | Slug: " + session.slug; 
      else 
      return "Graph | Slug: " + session.slug; 
  }


  export const parseDraftData = (draftsList, history) => {
    const resArray = [];
    draftsList.map( item => {
        resArray.push({
            itemIcon: ShowChart, 
            itemName: item.name, 
            dateCreated: parseDate(item.date),
            callback: () =>  history.push("/teacher/graph/" + item._id)
        })

    })
    return resArray; 
}

export const parseSessionData = (sessionsList, history) => {
    const resArray = [];
    sessionsList.map( item => {
        resArray.push({
            itemIcon: getSessionIcon(item), 
            itemName: item.name, 
            status: getSessionStatus(item), 
            itemType: getSessionTypeInfo(item), 
            dateCreated: parseEpocDate(item.createdAt),
            callback: () =>  history.push("/t/" + item.slug)
        })

    })
    return resArray; 
}
