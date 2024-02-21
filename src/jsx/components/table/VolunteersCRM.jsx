import React, { Fragment, useEffect, useState } from "react";
import PageTitle from "../../layouts/PageTitle";
import { Row, Col, Card, Table, Button, Modal } from "react-bootstrap";
import axios from "axios";
import { useFormik } from "formik";

import { fields } from "../../../lib/tableFields";
import { Input } from "../creatdComponents/Input";
import { createUser, deleteUser, updateUser } from "../../../lib/userCRUD";
import { YupUserSchema } from "../../../lib/YupSchemas";
import SortingTH from "../creatdComponents/SortingTH";
import SearchByInput from "../creatdComponents/SeachByInput";
import { useSearchParams } from "react-router-dom";
import swal from "sweetalert";

const VolunteersCRM = () => {
   const [users, setUsers] = useState([]);
   const [basicModal, setBasicModal] = useState(false);
   const [searchParams, setSearchParams] = useSearchParams();
   const sortOrder = searchParams.get("sortOrder");

   useEffect(() => {
      if (!sortOrder) {
         setSearchParams({ sortOrder: "Name-A-B" });
      }
      fetchUsers();
   }, [searchParams]);

   const API_URI = "https://kibbutzil.online/volunteers-forms";
   const API_URI_FILTERED = "https://kibbutzil.online/volunteers-forms/filters";

   const sortByOptions = {
      name: { sortBy: "Name", asc: "Name-A-B", desc: "Name-B-A" },
      yearExperience: {
         sortBy: "yearExperience",
         asc: "yearExperience-1-9",
         desc: "yearExperience-9-1",
      },
   };

   async function fetchUsers() {
      try {
         const users = await axios.post(API_URI_FILTERED, { sortOrder });

         setUsers(users.data);
         // console.log(users);
      } catch (error) {
         console.log(error);
      }
   }

   async function searchUser(search) {
      const { searchBy, searchValue } = search;
      try {
         const user = await axios.post(API_URI_FILTERED, {
            [searchBy]: searchValue,
         });
         setUsers(user.data);
      } catch (error) {
         console.log(error);
      }
   }

   async function handleDelete(user) {
      try {
         await deleteUser(API_URI, user._id);
         fetchUsers();
         swal("OK", "Successfully deleted", "success");
      } catch (error) {
         swal("Oops", "Something went wrong!", "error");
         console.log(error);
      }
   }

   async function handleCvDownload(id) {
      try {
         const res = await axios.get(
            `https://kibbutzil.online/volunteers-forms/CV/${id}`,
            { responseType: "blob" }
         );

         if (res.status !== 200) throw new Error("No CV found");
         const url = window.URL.createObjectURL(new Blob([res.data]));
         const link = document.createElement("a");
         link.href = url;
         link.setAttribute("download", "cv_file.pdf");
         link.click();
         window.URL.revokeObjectURL(url);
      } catch (error) {
         swal("Oops", "No CV found", "error");
         console.error();
      }
   }

   //User table row Component
   const MemberTr = ({ user = {}, index = 1 }) => {
      if (!user.fullName) return;
      return (
         <tr>
            <th className="align-middle">{index + 1}</th>
            {/*fullName  */}
            <td className="py-2">
               <span>{user.fullName}</span>
               <span></span>
            </td>
            {/*email  */}
            <td className="py-2">{user.email}</td>

            {/*phoneNumber  */}
            <td className="py-2">{user.phoneNumber}</td>

            {/*cv  */}
            <td className="py-2">
               <Button
                  onClick={() => handleCvDownload(user._id)}
                  className="me-2"
                  variant="light btn-rounded btn-sm d-flex"
               >
                  <span className="btn-icon-start text-light">
                     <i className="fa fa-download color-light" />
                  </span>
                  <div>CV</div>
               </Button>
            </td>

            {/*years experience  */}
            <td className="py-2 col-1">{user.yearExperience}</td>

            {/*gender  */}
            <td className="py-2">{user.gender}</td>
            {/*CRM  */}
            <td className="py-2 ">
               <div className="d-flex">
                  <Button
                     className="me-2 btn-sm"
                     variant="warning btn-rounded"
                     onClick={() => {
                        form.setValues(user);
                        setBasicModal(true);
                     }}
                  >
                     <i className="bi bi-pencil-square fs-5"></i>
                  </Button>
                  <Button
                     onClick={() => {
                        handleDelete(user);
                     }}
                     className="me-2 btn-sm"
                     variant="primary btn-rounded"
                  >
                     <i className="bi bi-trash fs-5"></i>
                  </Button>
               </div>
            </td>
         </tr>
      );
   };

   //Formik
   const YupNewVolunteerSchema = YupUserSchema().pick([
      "fullName",
      "email",
      "location",
      "phoneNumber",
      "gender",
      "positionAntilNow",
      "fecerPosition",
      "yearExperience",
      "linkdinURL",
   ]);

   const form = useFormik({
      validateOnMount: true,

      initialValues: {
         fullName: "",
         email: "",
         location: "",
         phoneNumber: "",
         gender: "",
         positionAntilNow: "",
         fecerPosition: "",
         yearExperience: "",
         linkdinURL: "",
      },
      validationSchema: YupNewVolunteerSchema,

      async onSubmit(values) {
         const processedValues = YupNewVolunteerSchema.validateSync(values);
         try {
            if (form.values._id) {
               await updateUser(API_URI, form.values._id, processedValues);
               swal("OK", "Successfully edited", "success");
            } else {
               await createUser(API_URI, processedValues);
               swal("OK", "Successfully added", "success");
            }
            form.resetForm();
            fetchUsers();
         } catch (error) {
            swal("Oops", "Something went wrong!", "error");
            console.log(error);
         }
      },
   });

   if (!sortOrder) return null;

   return (
      <Fragment>
         <PageTitle activeMenu="Members table CRM" motherMenu="Tables" />
         <Row>
            <Col lg={12}>
               <Card>
                  <Card.Header className="gap-3">
                     <Card.Title className="col-2">Members</Card.Title>

                     <SearchByInput
                        onSearchClick={searchUser}
                        onResetClick={fetchUsers}
                     />

                     <Button
                        className="me-2 col-2"
                        variant="outline-primary"
                        onClick={() => setBasicModal(true)}
                     >
                        + Add new member
                     </Button>
                  </Card.Header>
                  <Card.Body>
                     <Table responsive hover>
                        <thead>
                           <tr>
                              <th>#</th>

                              <SortingTH
                                 title={fields.fullName}
                                 filter={sortByOptions.name}
                              />
                              <th>{fields.email}</th>
                              <th>{fields.phoneNumber}</th>
                              <th>{fields.cv}</th>
                              <SortingTH
                                 title={fields.yearExperience}
                                 filter={sortByOptions.yearExperience}
                              />
                              <th>{fields.gender}</th>
                              <th>CRM</th>
                           </tr>
                        </thead>
                        <tbody>
                           {users.map((user, index) => (
                              <MemberTr key={index} user={user} index={index} />
                           ))}
                        </tbody>
                     </Table>
                  </Card.Body>
               </Card>
               {/* <!-- /# card --> */}
            </Col>
         </Row>

         {/* <!-- Modal --> */}
         <Modal
            className="fade"
            show={basicModal}
            dialogClassName="modal-dialog-centered
                modal-dialog-scrollable"
         >
            <Modal.Header>
               <Modal.Title>Modal title</Modal.Title>
               <Button
                  variant=""
                  className="btn-close"
                  onClick={() => {
                     setBasicModal(false);
                     form.resetForm();
                  }}
               ></Button>
            </Modal.Header>
            <Modal.Body>
               <div className="basic-form">
                  <form onSubmit={(e) => e.preventDefault()}>
                     {/* Full name */}

                     <Input
                        label={fields.fullName}
                        error={form.touched.fullName && form.errors.fullName}
                        required
                        {...form.getFieldProps("fullName")}
                     />

                     {/* email */}
                     <Input
                        label="Email"
                        error={form.touched.email && form.errors.email}
                        type="email"
                        required
                        {...form.getFieldProps("email")}
                     />
                     {/* phoneNumber */}
                     <Input
                        label="Phone"
                        error={
                           form.touched.phoneNumber && form.errors.phoneNumber
                        }
                        required
                        {...form.getFieldProps("phoneNumber")}
                     />

                     {/* location */}
                     <Input
                        label="Location"
                        error={form.touched.location && form.errors.location}
                        {...form.getFieldProps("location")}
                     />

                     {/* gender */}
                     <div className="form-group mb-3 row">
                        <label
                           htmlFor="gender"
                           className="col-sm-3 col-form-label"
                        >
                           Gender
                        </label>
                        <div className="col-sm-9">
                           <select
                              className="form-select"
                              style={{ height: "3rem" }}
                              id="gender"
                              value={form.values.gender}
                              onChange={(e) =>
                                 form.setFieldValue("gender", e.target.value)
                              }
                           >
                              <option>Choose...</option>
                              <option value="male">Male</option>
                              <option value="female">Female</option>
                           </select>
                        </div>
                     </div>

                     {/* positionAntilNow */}
                     <Input
                        label="positionAntilNow"
                        error={
                           form.touched.positionAntilNow &&
                           form.errors.positionAntilNow
                        }
                        {...form.getFieldProps("positionAntilNow")}
                     />

                     {/* fecerPosition */}
                     <Input
                        label="fecerPosition"
                        error={
                           form.touched.fecerPosition &&
                           form.errors.fecerPosition
                        }
                        {...form.getFieldProps("fecerPosition")}
                     />

                     {/* yearExperience */}
                     <Input
                        label="yearExperience"
                        error={
                           form.touched.yearExperience &&
                           form.errors.yearExperience
                        }
                        {...form.getFieldProps("yearExperience")}
                     />

                     {/* linkdinURL */}
                     <Input
                        label="linkdinURL"
                        error={
                           form.touched.linkdinURL && form.errors.linkdinURL
                        }
                        {...form.getFieldProps("linkdinURL")}
                     />
                  </form>
               </div>
            </Modal.Body>
            <Modal.Footer>
               <Button
                  onClick={() => {
                     setBasicModal(false);
                     form.resetForm();
                  }}
                  variant="danger light"
               >
                  Close
               </Button>
               <Button
                  onClick={() => {
                     form.handleSubmit();

                     setBasicModal(false);
                  }}
                  variant="primary"
               >
                  {form.values._id ? "Edit member" : "Add member"}
               </Button>
            </Modal.Footer>
         </Modal>
      </Fragment>
   );
};

export default VolunteersCRM;
