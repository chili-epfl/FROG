import acVideo from 'ac-video'
import acIframe from 'ac-iframe'
import acText from 'ac-text'
import acForm from 'ac-form'
import acCollabForm from 'ac-collab-form'
import acQuiz from 'ac-quiz'

import { keyBy } from 'lodash'

export const activity_types = [acVideo, acIframe, acText, acForm, acCollabForm, acQuiz]

export const activity_types_obj = keyBy(activity_types, 'id')
