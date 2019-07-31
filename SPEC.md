# FROG specifications

The goal of this development effort is to arrive at a version of chilifrog.ch which is coherent,
polished, stable and user-friendly, and let as many teachers as possible easily create and run
single activities and templates, as well as use the advanced editor to create and run custom graphs.
The latter will be used for CS411 and the MOOC this fall, as well as by some researchers and advanced
teachers.

There will be no distinction between "advanced FROG" and "simple FROG", this
functionality will be integrated into a single coherent interface, with the goal of making it as simple
as possible for new users to begin using FROG with a minimum of background knowledge or training, while
keeping the advanced features for power-users.

The FROG wiki will remain a completely distinct product (like GMail and Google Calendar, separate
products, with some integration points). The idea here is to enable use by people who have no concept
of orchestration graphs, and might not even be in educational settings (thus avoiding words like
teacher and student). However, like with GMail and Google Calendar, there are some integration points -
activities can be exported from a FROG session to a wiki, pages imported from a wiki to a FROG graph
etc.

## Overall flow

The chilifrog.ch landing page will be the central organizing principle. It is accessible without
logging in, and lets users easily create sessions based on single activities or templates, as well as
learn more about FROG. If users choose to log in (by choosing a display name/username, password and
email, without email verification), the homepage also lists their existing drafts, sessions and classes.

### Drafts and sessions

Currently in FROG, we distinguish between graphs and sessions, but the way people move from the graph
editor to the orchestration view has been confusing to users. Our proposal is to simplify by removing
the idea of a generic graph. In the future, you begin by editing a draft in the graph editor (unless
you use templates/single activity wizards). All testing of this graph (with four students etc) will
happen within the graph editor, without creating sessions. If users close the graph editor during this
process, the graph is available in the list of Drafts on the homepage.

Once the user is happy with their design, they can choose to Publish (/Run/Initiate etc) the graph. It
then turns into a session, and can no longer be edited. The user is taken directly to the orchestration
view (/session view/classroom view), and see their session waiting for the teacher to start.

If the teacher closes the Session, it will be available in the list of Sessions on the homepage (with
the status "Ready", "Running" or "Complete"). The teacher can always
return to a session, even after it has completed (at that point, the teacher can still see all the
dashboards, export data, etc).

From the homepage, the teacher can also choose to [clone/duplicate/create new graph based on] any
session. This is similar to a teacher creating a student worksheet in Word and saving it as
worksheet-one-2019.docx. When they want to reuse it, they might edit the file, and save the edited file
as worksheet-one-2020.docx.

## Common flows

Unless the teacher pastes in a URL captured during a previous session, they always begin at the
Chilifrog landing page. They might choose to create a new activity or template, which takes them
through a wizard and leads to the orchestration view. They might open a previous activity/template/
graph session in orchestration view to look at dashboards. They might create a new graph from scratch
in the advanced editor, or they might clone an existing session. (If they clone a template or activity,
they are taken back to the wizard. If they clone a custom graph, they are taken to the graph editor).

### Classes

Teachers have the option of creating ad-hoc sessions, however some teachers might have "classes"
which use FROG over a number of sessions. For this purpose, we want to add a very light-weight
"class" functionality. Teacher can create a new class, and each class is allocated a SLUG,
just like a session. When they run a template or graph, they are asked whether it belongs to a class.
All students accessing a session belonging to a class, will be added to the class list of that class
(but in the future, teachers might also upload a list of students). Teachers may indicate a fixed
social grouping in the class student list, and they may attach a wiki to the class.

They can also sort sessions on the frontpage according to the class they belong to.

### Graph editor

The top bar will be unified across FROG, and the pulldown menu to switch graphs will be moved to the
landing page (you will open a single draft on the landing page, and either publish it, which will take
you to the orchestration view, or close the graph editor to return to the landing page). The
functionality around exporting/importing from the cloud etc might also be moved to the landing page.

**Layout:** We have an idea of shrinking the graph editor and putting it at the bottom, freeing space
above to have the config panel and a live preview of the configured activity side-by-side. This concept
was present in some of the early mocks from Renato etc.

**Config/sidepanel:** We have already made the config code much more flexible, and we should go through
and redesign the actual config menus of the different activities to be clearer and with more
explanation. We have also added sub-sections to the activity menu, but where exactly different
activities fit in should be polished.

**Graph editor/data flow:** There are many things we could improve when it comes to the graph editor
and the core capabilities of the FROG engine, however the most important changes that have been
prioritized are:

- Modifying the social structure so that a) students can join late even after group-operators have
  run, and teachers can preview and do live repair of social structures during orchestration. (Also
  probably remove the need to explicitly link to every single activity on a p2 level).

- Implementing the [direct linking spec](https://docs.google.com/document/d/1JwSsSGWfAn_8OhILf2ZlJbGN23L2TV6k9SUWYwbueOU/edit?usp=drive_web&ouid=107702703184747130690)
  which will radically reduce the number of operators/lines required to express common flows.
- Add type checking of content flows to ensure that no invalid graphs can be run.
- Enable running template wizards and inserting the result in the middle of a graph.

### Orchestration view (/session view/classroom view)

The orchestration view will have three sections - a side panel, a bottom panel, and a large central
content panel. We will radically shrink the graph editor, and have it always present at the bottom of
the screen (bottom panel). We might remove connections and operators, and optimize for legibility. The
graph view will show at a glance the lesson plan, what is currently happening, and what will happen
next, and clicking on activities will show dashboards/previews of that activity.

On the side panel, we will show a list of students logged in, and the current instances. Clicking on an
instance/student will allow you to "peek" at their currently running activity. We might also
offer a list of activities as an alternative way of accessing information.

The content panel will aim to show all the information that is required by teachers. If a p3 activity
is active, there is no dashboard, and the teacher directly sees and can participate in the activity
(there will be a button to open this pane in a separate window, similar to the projector view, but that
will be an advanced option, and not like today the required mode). If a p1/p2 activity is active, the
teacher can toggle between a) seeing a preview of the activity (this is what will be sent to projector
view, if the teacher opens in a separate pane), b) seeing dashboards or c) peeking at the screens of
individual students/groups.

_Open issues:_ What to do about multiple activities open simultaneously, especially when they are on different planes?

_Possible solutions:_ When multiple activities are open at the same time, one of the two activities
often serves to provide information, either static, or from a previous activity… When it is static, we
might think of eventually moving this into metadata of the main activity (and have a way in the student
view of displaying it nicely, see below). When it is displaying info from a previous activity, perhaps
we have a way of denoting an activity the "primary" activity? Otherwise, we can of course
either: let users click to select the activity to display, or display both activities side-by-side…

There should be a way for teachers to see the social structure of current activities, either by
clicking on the activities, or perhaps clicking on the social structure. They should also be able to
modify the social structure by dragging students from one group to another (which requires a more
flexible social structure, see above).

We have also discussed the idea of being able to put operators before a "start" line, meaning
that they would execute before the first activity is open, and let the teacher inspect the content -
both in terms of social structures, but also in terms of imported content (did Twitter run correctly?
Do you want to remove some items?).

### Student view

We have discussed the idea of having a generic landing page for students, student accounts with
passwords etc, but we prefer to keep the student interface as simple as possible. One idea is to have a
separate domain for students (like learn.chilifrog.ch), where the landing page (if you did not specify
a slug) would simply have a big box asking you to type in the slug.

For one-off sessions, students will enter the session through the slug. For classes, there is a single
slug assigned to the class. When any session is running associated with that slug, that's what the
students will see, and if there is a wiki associated with the class, they will see the wiki when
accessing that slug without a class running.

For the actual student interface, we are fairly happy with what we have today. We have long thought
about redesigning especially the p2 interface to be a bit more integrated, providing instructions in a
consistent location (hideable), social presence avatars, ability to ask for help or send messages,
perhaps even chat as a custom element that can be hidden etc. This probably will not happen before the
fall.

## Future work

### Graph editor/data flow

- More flexible time
- Copy and paste, more flexible editing of graphs

### Orchestration view

- More communication between teacher and students (students raise hands, and teacher is pinged,
  teacher can send messages to class/different groups)
- A limited and safe ability to edit a currently running graph

### Student view

See integrated view described above.
