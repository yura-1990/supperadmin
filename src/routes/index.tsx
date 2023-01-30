import { SignIn } from "../app/pages/Auth/Signin/LoadableSignIn";
// import { FiUsers, FiUpload } from "react-icons/fi";
// import { MdNotificationsNone } from "react-icons/md";
import { Members } from "../app/pages/Main/Members/LoadableMembers";
import { Notifications } from "../app/pages/Main/Notifications/LoadableNotif";
import { Uploades } from "../app/pages/Main/Uploads/LoadableUploades";
import { Times } from '../app/pages/Main/Time/LoadableTimes'
import { Directions } from "../app/pages/Main/Directions/LoadableDirections"; 
/* import  */

export const AUTH_ROUTES = [
  {
    path: "/",
    element: SignIn,
  },
];

export const MAIN_ROUTES = [
  {
    path: "/",
    element: Members,
  },
  {
    path: "/uploads",
    element: Uploades,
  },
  {
    path: "/notifications",
    element: Notifications,
  },
  {
    path: "/time",
    element: Times,
  },
  {
    path: "/direction",
    element: Directions,
  },
];
