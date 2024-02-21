import React, { Fragment, useEffect, useState } from "react";
import PageTitle from "../../layouts/PageTitle";
import { Row, Col, Card, Table, Button, Modal } from "react-bootstrap";
import { useFormik } from "formik";

import { fields } from "../../../lib/tableFields";
import { Input } from "../creatdComponents/Input";
import {
   createUser,
   deleteUser,
   fetchUsers,
   updateUser,
} from "../../../lib/userCRUD";
import { YupUserSchema } from "../../../lib/YupSchemas";
import swal from "sweetalert";
import { generateRandomPassword } from "../../../lib/generatePassword";

const MembersTableCRM = () => {
   const [users, setUsers] = useState([]);
   const [basicModal, setBasicModal] = useState(false);
   const [serverError, setServerError] = useState(null);

   useEffect(() => {
      fetchUsers(API_URI)
         .then((res) => {
            setUsers(res.data);
         })
         .catch(console.log);
   }, []);

   const API_URI = "https://kibbutzil.online/users";

   function handleDelete(user) {
      deleteUser(API_URI, user._id)
         .then(() => fetchUsers(API_URI))
         .then(setUsers)
         .catch(console.log);
   }

   //User table row Component
   const MemberTr = ({ user = {}, index = 1 }) => {
      if (!user.firstName) return;
      return (
         <tr>
            <th className="align-middle">{index + 1}</th>
            {/*fullName  */}
            <td className="py-2">{user.firstName + " " + user.lastName}</td>
            {/*email  */}
            <td className="py-2">{user.email}</td>
            {/*role  */}
            <td className="py-2">{user.role}</td>
            {/*location  */}
            <td className="py-2">{user.location}</td>
            {/*phoneNumber  */}
            <td className="py-2">{user.phoneNumber}</td>
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
                        console.log(user);
                        setBasicModal(true);
                     }}
                  >
                     <i className="bi bi-pencil-square fs-5"></i>
                  </Button>
                  <Button
                     onClick={() => handleDelete(user)}
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

   const YupNewMemberSchema = YupUserSchema().pick([
      "firstName",
      "lastName",
      "email",
      "role",
      "location",
      "phoneNumber",
      "gender",
      "positionAntilNow",
      "fecerPosition",
      "yearExperience",
      "linkdinURL",
   ]);

   //Formik
   const form = useFormik({
      validateOnMount: true,

      initialValues: {
         firstName: "",
         lastName: "",
         email: "",
         password: generateRandomPassword(12),
         role: "user",
         location: "",
         phoneNumber: "",
         gender: "",
         positionAntilNow: "",
         fecerPosition: "",
         yearExperience: "",
         linkdinURL: "",
      },
      validationSchema: YupNewMemberSchema,

      async onSubmit(values) {
         const processedValues = await YupNewMemberSchema.validate(values);
         try {
            if (form.values._id) {
               await updateUser(API_URI, form.values._id, processedValues);
               swal("OK", "User updated", "success");
            } else {
               processedValues.passwordConfirm = form.values.password;
               const res = await createUser(
                  `${API_URI}/signup`,
                  processedValues
               );
               console.log(res);
               swal("OK", "User created", "success");
            }
            setBasicModal(false);

            form.resetForm();
            fetchUsers(API_URI).then((res) => setUsers(res.data));
         } catch (error) {
            swal("Oops", "Something went wrong!", "error");

            console.log(error);
         }
      },
   });

   return (
      <Fragment>
         <PageTitle activeMenu="Members table CRM" motherMenu="Tables" />
         <Row>
            <Col lg={12}>
               <Card>
                  <Card.Header>
                     <Card.Title>Members</Card.Title>
                     <Button
                        className="me-2"
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
                              <th>{fields.fullName}</th>
                              <th>{fields.email}</th>
                              <th>{fields.role}</th>
                              <th>{fields.location}</th>
                              <th>{fields.phoneNumber}</th>
                              <th>{fields.gender}</th>
                              <th>CRM</th>
                           </tr>
                        </thead>
                        <tbody>
                           {users
                              .map((user, index) => {
                                 return (
                                    <MemberTr
                                       key={index}
                                       user={user}
                                       index={index}
                                    />
                                 );
                              })
                              .sort()}
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
                     {/* first name */}

                     <Input
                        label={fields.firstName}
                        error={form.touched.firstName && form.errors.firstName}
                        required
                        {...form.getFieldProps("firstName")}
                     />

                     {/* last name */}

                     <Input
                        label="Last Name"
                        error={form.touched.lastName && form.errors.lastName}
                        required
                        {...form.getFieldProps("lastName")}
                     />

                     {/* email */}
                     <Input
                        label="Email"
                        error={form.touched.email && form.errors.email}
                        type="email"
                        required
                        {...form.getFieldProps("email")}
                     />

                     <Input
                        label="Generated Password"
                        type="text"
                        readOnly
                        disabled
                        value={form.values.password}
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

                     {/* role */}

                     <div className="form-group mb-3 row">
                        <label
                           htmlFor="role"
                           className="col-sm-3 col-form-label"
                        >
                           Role
                        </label>
                        <div className="col-sm-9">
                           <select
                              className="form-select"
                              style={{ height: "3rem" }}
                              id="role"
                              name="role"
                              value={form.values.role}
                              onChange={form.handleChange}
                           >
                              <option value="user">User</option>
                              <option value="admin">Admin</option>
                           </select>
                        </div>
                     </div>

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
               <Button onClick={form.handleSubmit} variant="primary">
                  {form.values._id ? "Edit member" : "Add member"}
               </Button>
            </Modal.Footer>
         </Modal>
      </Fragment>
   );
};

export default MembersTableCRM;
