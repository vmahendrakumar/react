import React from "react";
import { Redirect } from "react-router-dom";

// Layout Types
import { DefaultLayout } from "./layouts";

// Route Views
import BlogOverview from "./views/BlogOverview";
import UserProfileLite from "./views/UserProfileLite";
import AddNewPost from "./views/AddNewPost";
import Errors from "./views/Errors";
import ComponentsOverview from "./views/ComponentsOverview";
import Tables from "./views/Tables";
import BlogPosts from "./views/BlogPosts";
import Timesheets from "./views/Timesheet/Timesheets";
import AddTimesheet from "./views/Timesheet/AddTimesheet";
import EditTimesheet from "./views/Timesheet/EditTimesheet";
import TimesheetReport from "./views/Timesheet/TimesheetReport";

export default [
  
  /*
  {
    path: "/",
    exact: true,
    layout: DefaultLayout,
    component: () => <Redirect to="/blog-overview" />
  },
  */  
  {
    path: "/",
    exact: true,
    layout: DefaultLayout,
    component: () => <Redirect to="/timesheets" />
  },
  {
    path: "/timesheets",
    layout: DefaultLayout,
    component: Timesheets
  },
  {
    path: "/addtimesheet",
    layout: DefaultLayout,
    component: AddTimesheet
  },
  {
    path: "/edittimesheet",
    layout: DefaultLayout,
    component: EditTimesheet
  },
  {
    path: "/timesheetreport",
    layout: DefaultLayout,
    component: TimesheetReport
  },
  
  /*
  {
    path: "/blog-overview",
    layout: DefaultLayout,
    component: BlogOverview
  },
  {
    path: "/user-profile-lite",
    layout: DefaultLayout,
    component: UserProfileLite
  },
  {
    path: "/add-new-post",
    layout: DefaultLayout,
    component: AddNewPost
  },
  {
    path: "/errors",
    layout: DefaultLayout,
    component: Errors
  },
  {
    path: "/components-overview",
    layout: DefaultLayout,
    component: ComponentsOverview
  },
  {
    path: "/tables",
    layout: DefaultLayout,
    component: Tables
  },
  {
    path: "/blog-posts",
    layout: DefaultLayout,
    component: BlogPosts
  }
  */
];
