import React, { useEffect, useContext, useReducer, useState } from "react";
/// Scroll
import PerfectScrollbar from "react-perfect-scrollbar";
import { Collapse, Dropdown } from "react-bootstrap";
/// Link
import { Link } from "react-router-dom";
import { MenuList } from "./Menu";
import { useScrollPosition } from "@n8tb1t/use-scroll-position";
import { ThemeContext } from "../../../context/ThemeContext";

import profile from "../../../images/user.jpg";

import LogoutPage from "./Logout"

const reducer = (previousState, updatedState) => ({
   ...previousState,
   ...updatedState,
});

const initialState = {
   active: "",
   activeSubmenu: "",
};

const SideBar = () => {
   var d = new Date();
   const {
      iconHover,
      sidebarposition,
      headerposition,
      sidebarLayout,
      ChangeIconSidebar,
   } = useContext(ThemeContext);

   const [state, setState] = useReducer(reducer, initialState);

   //For scroll

   let handleheartBlast = document.querySelector(".heart");
   function heartBlast() {
      return handleheartBlast.classList.toggle("heart-blast");
   }

   const [hideOnScroll, setHideOnScroll] = useState(true);
   useScrollPosition(
      ({ prevPos, currPos }) => {
         const isShow = currPos.y > prevPos.y;
         if (isShow !== hideOnScroll) setHideOnScroll(isShow);
      },
      [hideOnScroll]
   );
   const handleMenuActive = (status) => {
      setState({ active: status });
      if (state.active === status) {
         setState({ active: "" });
      }
   };
   const handleSubmenuActive = (status) => {
      setState({ activeSubmenu: status });
      if (state.activeSubmenu === status) {
         setState({ activeSubmenu: "" });
      }
   };
   // Menu dropdown list End

   /// Path
   let path = window.location.pathname;
   //path = path.split("/");
   //path = path[path.length - 1];
   /// Active menu

   return (
      <div
         onMouseEnter={() => ChangeIconSidebar(true)}
         onMouseLeave={() => ChangeIconSidebar(false)}
         className={`dlabnav ${iconHover} ${sidebarposition.value === "fixed" &&
               sidebarLayout.value === "horizontal" &&
               headerposition.value === "static"
               ? hideOnScroll > 120
                  ? "fixed"
                  : ""
               : ""
            }`}
      >
         <PerfectScrollbar className="dlabnav-scroll">
            <ul className="metismenu" id="menu">
               {MenuList.map((data, index) => {
                  let menuClass = data.classsChange;
                  if (menuClass === "menu-title") {
                     return (
                        <li className={menuClass} key={index}>
                           {data.title}
                        </li>
                     );
                  } else {
                     return (
                        <li
                           className={` ${state.active === data.title ? "mm-active" : ""
                              }`}
                           key={index}
                        >
                           {data.content && data.content.length > 0 ? (
                              <>
                                 <Link
                                    to={"#"}
                                    className="has-arrow"
                                    onClick={() => {
                                       handleMenuActive(data.title);
                                    }}
                                 >
                                    {data.iconStyle}
                                    <span className="nav-text">
                                       {data.title}
                                    </span>
                                 </Link>
                                 <Collapse
                                    in={
                                       state.active === data.title
                                          ? true
                                          : false
                                    }
                                 >
                                    <ul
                                       className={`${menuClass === "mm-collapse"
                                             ? "mm-show"
                                             : ""
                                          }`}
                                    >
                                       {data.content &&
                                          data.content.map((data, index) => {
                                             return (
                                                <li
                                                   key={index}
                                                   className={`${state.activeSubmenu ===
                                                         data.title
                                                         ? "mm-active"
                                                         : ""
                                                      }`}
                                                >
                                                   {data.content &&
                                                      data.content.length > 0 ? (
                                                      <>
                                                         <Link
                                                            to={data.to}
                                                            className={
                                                               data.hasMenu
                                                                  ? "has-arrow"
                                                                  : ""
                                                            }
                                                            onClick={() => {
                                                               handleSubmenuActive(
                                                                  data.title
                                                               );
                                                            }}
                                                         >
                                                            {data.title}
                                                         </Link>
                                                         <Collapse
                                                            in={
                                                               state.activeSubmenu ===
                                                                  data.title
                                                                  ? true
                                                                  : false
                                                            }
                                                         >
                                                            <ul
                                                               className={`${menuClass ===
                                                                     "mm-collapse"
                                                                     ? "mm-show"
                                                                     : ""
                                                                  }`}
                                                            >
                                                               {data.content &&
                                                                  data.content.map(
                                                                     (
                                                                        data,
                                                                        index
                                                                     ) => {
                                                                        return (
                                                                           <li
                                                                              key={
                                                                                 index
                                                                              }
                                                                           >
                                                                              <Link
                                                                                 className={`${path ===
                                                                                       data.to
                                                                                       ? "mm-active"
                                                                                       : ""
                                                                                    }`}
                                                                                 to={
                                                                                    data.to
                                                                                 }
                                                                              >
                                                                                 {
                                                                                    data.title
                                                                                 }
                                                                              </Link>
                                                                           </li>
                                                                        );
                                                                     }
                                                                  )}
                                                            </ul>
                                                         </Collapse>
                                                      </>
                                                   ) : (
                                                      <Link to={data.to}>
                                                         {data.title}
                                                      </Link>
                                                   )}
                                                </li>
                                             );
                                          })}
                                    </ul>
                                 </Collapse>
                              </>
                           ) : (
                              <Link to={data.to}>
                                 {data.iconStyle}
                                 <span className="nav-text">{data.title}</span>
                              </Link>
                           )}
                        </li>
                     );
                  }
               })}
            {/* <div className="dropdown header-profile2 ">
            <div className="header-info2 text-center">
              <img src={profile} alt="" />
              <div className="sidebar-info">
                <div>
                  <h5 className="font-w500 mb-0">William Johanson</h5>
                  <span className="fs-12">williamjohn@mail.com</span>
                </div>	
              </div>
              <div>
                <Link to={"#"} className="btn btn-md text-secondary">Contact Us</Link>
              </div>
            </div>
          </div> */}
            </ul>
            <div className="copyright">
               <p className="fs-12 text-center">
                  Made with{" "}
                  <span className="heart" onClick={() => heartBlast()}></span>{" "}
                  by kibbutzIL
               </p>
            </div>
            <li> <LogoutPage /></li>
         </PerfectScrollbar>
      </div>
   );
};

export default SideBar;
