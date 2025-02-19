import { useEffect, useRef, useState, useTransition } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Form, Schema } from "rsuite"
import { addUser, updateUser } from "../../store/userSlice";
import { toast } from "react-toastify";
import optionToast from "../../constants/optionToast";
import { useNavigate, useParams } from "react-router";

const { StringType } = Schema.Types;
const model = Schema.Model({
  name: StringType().isRequired("Name required"),
  email: StringType().isEmail("Invalid email").isRequired("Email required"),
  company: StringType().isRequired("Company required"),
});

const Index = () => {
  const formRef = useRef()
  const [formValue, setFormValue] = useState({
    name: "",
    email: "",
    company: "",
  });
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { id } = useParams()
  const [isPending, startTransition] = useTransition();
  const { defaultData, searchTerm } = useSelector(state => state.userSlice)
  console.log(searchTerm);


  useEffect(() => {
    if (id) {
      const user = defaultData.find(u => u.id === parseInt(id));
      if (user) {
        setFormValue({
          ...user
        });
      }
    }
  }, [id, defaultData]);

  const handleFormUser = () => {
    startTransition(() => {
      if (!formRef.current.check()) {
        toast.error(`Please fill in all required fields`, optionToast);
        return;
      }

      if (id) {
        dispatch(
          updateUser({ ...formValue, id: parseInt(id) })
        )
      } else {
        dispatch(
          addUser({
            id: Date.now(),
            name: formValue.name,
            email: formValue.email,
            company: formValue.company
          })
        )
      }

      formRef.current.reset();
      toast.success(`User ${id ? "updated" : "added"} successfully`, optionToast);
      setTimeout(() => {
        navigate("/");
      }, 500);
    })


  };

  return (
    <Form
      ref={formRef}
      formValue={formValue}
      onChange={setFormValue}
      onSubmit={handleFormUser}
      model={model}
      fluid
    >
      <Form.Group controlId="name">
        <Form.ControlLabel>Name</Form.ControlLabel>
        <Form.Control name="name" />
      </Form.Group>
      <Form.Group controlId="email">
        <Form.ControlLabel>Email</Form.ControlLabel>
        <Form.Control name="email" type="email" />
      </Form.Group>
      <Form.Group controlId="company">
        <Form.ControlLabel>Company</Form.ControlLabel>
        <Form.Control name="company" type="text" autoComplete="off" />
      </Form.Group>
      <Form.Group>
        <Button appearance="primary" type="submit" loading={isPending}>Submit</Button>
      </Form.Group>
    </Form>
  )
}

export default Index