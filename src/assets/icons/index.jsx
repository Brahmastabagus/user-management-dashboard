import { Button, Form, InputNumber, Loader, Modal, Placeholder, Schema, SelectPicker, Toggle, Uploader } from "rsuite"
import Onboarding from "../../../components/layouts/onboarding"
import { Tab } from "@headlessui/react"
import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getProfession, setProfession, setGalleryProfession, getStat, setStat, setDeleteGallery } from "../../../store/professionSlice";
import { toast } from "react-toastify";
import optionToast from "../../../constants/optionToast";
import previewFile from "../../../utils/previewFile";
import { deleteService, getListService, getService, updateService } from "../../../store/serviceSlice";
import { dataDownpayment, dataDurationHour, dataDurationMinute, dataFee } from "../../../constants/service";
import { TfiAlert } from "react-icons/tfi";
import { LazyLoadImage } from "react-lazy-load-image-component";
import cn from "../../../utils/cn";
import { checkComplete } from "../../../utils/checkComplete";
import Textarea from "../../../components/Textarea";
import { getBank } from "../../../store/bankSlice";
import { getProfile } from "../../../store/userSlice";
const Profesi = lazy(() => import("../../../components/onboarding/Profesi"));

const data = [
  { category: 'Performers', value: "Musician" },
  // { category: 'Performers', value: "Dancer" },
  { category: 'Performers', value: "Comedian" },
  { category: 'Performers', value: "Magician" },
  { category: 'Visual Creatives', value: "Photographer" },
  { category: 'Visual Creatives', value: "Videographer" },
  { category: 'Beauty & Fashion', value: "Model" },
  { category: 'Beauty & Fashion', value: "Makeup Artist / Hairstylist" },
  // { category: 'Beauty & Fashion', value: "Hair Stylist" },
  // { category: 'Event Services', value: "Event Host / MC" },
  // { category: 'Event Services', value: "Event Planner / Coordinator" },
  // { category: 'Event Services', value: "Vendor / Equipment Provider" },
  // { category: 'Other', value: "Content Creator / Influencer" },
]

const renderMenuItem = (label) => {
  return (
    <Box>
      {label}
    </Box>
  );
};

const renderMenuGroup = (label, item) => {
  return (
    <Box className="!text-primary almarai-bold tracking-wide">
      {label} - ({item.children.length})
    </Box>
  );
};

const Box = ({ className, children }) => {
  return <div style={{ display: 'flex', alignItems: 'center', gap: 10 }} className={className}>{children}</div>;
};

const { StringType, NumberType } = Schema.Types;
const modelService = Schema.Model({
  name: StringType().isRequired("Name required"),
  type_fee: StringType().isRequired("Type fee required"),
  fee: StringType().isRequired("Fee required"),
  duration_hour: NumberType().isRequired("Duration hour required"),
  duration_minute: NumberType().isRequired("Duration minute required"),
  downpayment: NumberType().isRequired("Downpayment required"),
  finalpayment: NumberType().isRequired("Finalpayment required"),
})

const Index = () => {
  const formRef = useRef();
  const formStatRef = useRef();
  const formServiceRef = useRef();
  const [uploading, setUploading] = useState(false);
  const [fileImages, setFileImages] = useState({});
  const [infoImage, setInfoImage] = useState(null);
  const [previewImage, setPreviewImage] = useState({ pos: 0, image: null });
  const [defaultData, setDefaultData] = useState({})
  const [stats, setStats] = useState([])
  const [service, setService] = useState([])
  const [formValue, setFormValue] = useState({})
  const [professional, setProfessional] = useState(1)
  const [isComplete, setIsComplete] = useState(false)
  const [isType, setIsType] = useState(false)
  const [serviceId, setServiceId] = useState(0)
  const [load, setLoad] = useState(false);
  const [services, setServices] = useState([]);
  const [bank, setBank] = useState({});
  const [phoneNumber, setPhoneNumber] = useState({});
  const dispatch = useDispatch();
  const navigate = useNavigate()

  const { status } = useSelector(state => state.professionSlice)

  useEffect(() => {
    dispatch(getProfession(professional)).then(res => {
      setDefaultData(res.payload.data[0])
      res.payload.data[0]?.type ? setIsType(true) : setIsType(false)
    })
  }, [dispatch, professional])

  useEffect(() => {
    setFileImages({ image1: defaultData?.image1, image2: defaultData?.image2, image3: defaultData?.image3, image4: defaultData?.image4, image5: defaultData?.image5 })
  }, [defaultData])

  useEffect(() => {
    dispatch(getStat(professional)).then(res => setStats(res.payload.data[0].stat))
  }, [dispatch, professional])

  useEffect(() => {
    dispatch(getService(professional)).then(res => setService(res.payload.data.services))
  }, [dispatch, professional])

  useEffect(() => {
    dispatch(getBank()).then(res => setBank(res.payload.data[0].bank))
    dispatch(getProfile()).then(res => setPhoneNumber(res.payload.data[0].phone))
  }, [dispatch])

  useEffect(() => {
    if (checkComplete(defaultData, stats, service)) {
      setIsComplete(true)
    }
  }, [defaultData, stats, service])

  const [openGallery, setOpenGallery] = useState(false);
  const handleOpenGallery = (pos) => {
    setFileImages({ ...fileImages, position: pos });
    setOpenGallery(true);
  }
  const handleCloseGallery = () => {
    setOpenGallery(false);
    setInfoImage(null);
  }

  const [openDeleteImage, setOpenDeleteImage] = useState(false);
  const handleOpenDeleteImage = (pos) => {
    setFileImages({ ...fileImages, position: pos, image: null });
    setOpenDeleteImage(true);
  }
  const handleCloseDeleteImage = () => {
    setOpenDeleteImage(false);
    setInfoImage(null);
  }

  const [openPreview, setOpenPreview] = useState(false);
  const handleOpenPreview = (pos, image) => {
    setPreviewImage({ pos, image });
    setOpenPreview(true);
  }
  const handleClosePreview = () => {
    setOpenPreview(false);
    setPreviewImage({ pos: 0, image: null });
  }

  const [openUpdateInfo, setOpenUpdateInfo] = useState(false);
  const handleOpenUpdateInfo = () => setOpenUpdateInfo(true);
  const handleCloseUpdateInfo = () => setOpenUpdateInfo(false);

  const [openConfirm, setOpenConfirm] = useState(false);
  const handleConfirm = () => setOpenConfirm(true);
  const handleCloseConfirm = () => setOpenConfirm(false);

  // const [openFill, setOpenFill] = useState(false);
  // const [fillTitle, setFillTitle] = useState("");
  // const [fillLink, setFillLink] = useState("");
  // const handleFill = () => setOpenFill(true)
  // const handleCloseFill = () => setOpenFill(false);

  // const handleType = () => {
  //   if (bank === null && phoneNumber === null) {
  //     setFillTitle("Bank and Phone Number")
  //     setFillLink("http://enternica.com/dashboard/payment")
  //     handleFill()
  //   } else if (phoneNumber === null) {
  //     setFillTitle("Phone Number")
  //     setFillLink("http://enternica.com/dashboard/account")
  //     handleFill()
  //   } else if (bank === null) {
  //     setFillTitle("Bank")
  //     setFillLink("http://enternica.com/dashboard/payment")
  //     handleFill()
  //   } else {
  //     handleSubmitType()
  //   }
  // }

  const [openUpdateService, setOpenUpdateService] = useState(false);
  const handleOpenUpdateService = (data) => {
    setOpenUpdateService(true)
    setFormValue(data)
    setFormValue(prev => ({ ...prev, fee: data.fee.toString(), duration_hour: Number(data.duration_hour), duration_minute: Number(data.duration_minute), downpayment: Number(data.downpayment), finalpayment: Number(data.finalpayment) }))
    services.length === 0 && dispatch(getListService(professional)).then(res => setServices(res.payload.data))
  }
  const handleCloseUpdateService = () => setOpenUpdateService(false);

  const [openDeleteService, setOpenDeleteService] = useState(false);
  const handleOpenDeleteService = (id) => {
    setOpenDeleteService(true)
    setServiceId(id)
  }
  const handleCloseDeleteService = () => setOpenDeleteService(false);

  const handleStatTempChange = (index, value, e) => {
    const newStatTemp = [...stats];
    newStatTemp[index] = { ...newStatTemp[index], [e.target.name]: value };
    setStats(newStatTemp);
  };

  const addStatTemp = () => {
    setStats([...stats, { title: "", value: "" }]);
  };

  const removeStatTemp = (index) => {
    const newStatTemp = [...stats];
    newStatTemp.splice(index, 1);
    setStats(newStatTemp);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { profposition: professional, type: defaultData?.type, riders: defaultData?.riders };

    setLoad(true);
    setIsType(false)

    try {
      const res = await dispatch(setProfession(payload)).unwrap()
      toast.success(res?.data?.message, optionToast);
      setTimeout(() => {
        setIsType(true)
        window.location.reload();
      }, 1500);
    } catch (err) {
      if (Array.isArray(err?.message)) {
        err?.message.forEach((msg) => toast.error(msg, optionToast));
      } else {
        toast.error(err?.message, optionToast);
      }
      setLoad(false);
    }
  }

  const handleSubmitType = async (e) => {
    const payload = { profposition: professional, type: e };

    setLoad(true);
    setIsType(false)

    try {
      const res = await dispatch(setProfession(payload)).unwrap()
      toast.success(res?.data?.message, optionToast);
      setTimeout(() => {
        setIsType(true);
        dispatch(getProfession(professional)).then(res => {
          setDefaultData(res.payload.data[0])
          res.payload.data[0]?.type ? setIsType(true) : setIsType(false)
        })
        setLoad(false)
      }, 1500);
    } catch (err) {
      if (Array.isArray(err?.message)) {
        err?.message.forEach((msg) => toast.error(msg, optionToast));
      } else {
        toast.error(err?.message, optionToast);
      }
      setLoad(false);
    }
  }

  const uploadImage = async () => {
    setUploading(true);

    try {
      const res = await dispatch(setGalleryProfession({ image: fileImages.image, position: fileImages.position, profposition: professional })).unwrap()
      toast.success(res?.data?.message, optionToast);
      setUploading(false);
      setTimeout(() => {
        window.location.reload();
        setOpenGallery(false);
        setInfoImage(null);
        setPreviewImage({ pos: 0, image: null });
        setOpenPreview(false);
      }, 1500);
    } catch (err) {
      if (Array.isArray(err?.message)) {
        err?.message.forEach((msg) => toast.error(msg, optionToast));
      } else {
        toast.error(err?.message, optionToast);
      }
      setUploading(false);
    }
  }

  const deleteImage = async () => {
    setUploading(true);

    try {
      const res = await dispatch(setDeleteGallery({ image: fileImages.image, position: fileImages.position, profposition: professional })).unwrap()
      toast.success(res?.data?.message, optionToast);
      setUploading(false);
      setTimeout(() => {
        window.location.reload();
        setOpenDeleteImage(false);
        setInfoImage(null);
        setPreviewImage({ pos: 0, image: null });
        setOpenPreview(false);
      }, 1500);
    } catch (err) {
      if (Array.isArray(err?.message)) {
        err?.message.forEach((msg) => toast.error(msg, optionToast));
      } else {
        toast.error(err?.message, optionToast);
      }
      setUploading(false);
    }
  }

  const handleStat = async (e) => {
    e.preventDefault()

    const keysToKeep = ['title', 'value'];
    const filteredObjects = stats.map(obj => {
      return Object.fromEntries(
        Object.entries(obj).filter(([key,]) => keysToKeep.includes(key))
      );
    });

    const payload = { profposition: professional, stat: filteredObjects }
    setLoad(true);

    try {
      const res = await dispatch(setStat(payload)).unwrap()
      toast.success(res?.data?.message, optionToast);
      dispatch(getStat(professional));
      dispatch(getProfession(professional));
      setTimeout(() => {
        setOpenUpdateInfo(false);
        setLoad(false);
      }, 1500);
    } catch (err) {
      if (Array.isArray(err?.message)) {
        err?.message.forEach((msg) => toast.error(msg, optionToast));
      } else {
        toast.error(err?.message, optionToast);
      }
      setLoad(false);
    }
  }

  const updateDataService = () => {
    services.length === 0 && dispatch(getListService(professional)).then(res => setServices(res.payload.data))
  }

  const renderMenu = menu => {
    if (services.length === 0) {
      return (
        <p style={{ padding: 4, color: '#999', textAlign: 'center' }}>
          Loading...
        </p>
      );
    }
    return menu;
  };

  const serviceList = services?.map(item => ({
    label: item,
    value: item
  }));

  const handleService = async (e) => {
    e.preventDefault();

    if (!formServiceRef.current.check()) {
      toast.error(`Please fill in all required fields`, optionToast);
      return;
    }

    setLoad(true);
    const payload = {
      service_id: formValue.id,
      name: formValue.name,
      desc: formValue.desc,
      // type_rates: formValue.type_rates,
      type_fee: formValue.type_fee,
      fee: formValue.fee,
      duration_hour: formValue.duration_hour,
      duration_minute: formValue.duration_minute,
      downpayment: formValue.downpayment,
      finalpayment: formValue.finalpayment,
      hide: formValue.hide ? 1 : 0
    };
    try {
      const res = await dispatch(updateService(payload)).unwrap()
      toast.success(res?.data?.message, optionToast);
      setTimeout(() => {
        setLoad(false);
        window.location.reload();
      }, 1500);
    } catch (err) {
      console.log(err)
      setLoad(false);
      toast.error(err?.message);
    }
  }

  const handleDeleteService = async (e) => {
    e.preventDefault();

    setLoad(true);
    try {
      const res = await dispatch(deleteService({ service_id: serviceId })).unwrap()
      toast.success(res?.data?.message, optionToast);
      setTimeout(() => {
        setLoad(false);
        window.location.reload();
      }, 1500);
    } catch (err) {
      handleCloseDeleteService()
      setLoad(false);
      toast.error(err?.message);
    }
  }

  return (
    <Onboarding>
      <div className="mx-auto almarai-bold text-2xl mt-5 flex items-center justify-start after:flex-1 after:border-t-2 after:border-gray-200 after:ms-2 lg:justify-center lg:after:hidden">Profession Setup</div>
      <Tab.Group>
        <Tab.List className="flex space-x-1 bg-transparent px-2">
          <Tab
            key="Profession1"
            onClick={() => setProfessional(1)}
            className={({ selected }) =>
              cn(
                'w-full py-2.5 text-sm font-medium leading-5 ',
                'focus:outline-none focus:ring-0',
                selected
                  ? 'bg-transparent text-primary border-b-2 border-primary stroke-primary'
                  : 'text-[#565D6D] hover:bg-white/[0.12] hover:text-white stroke-[#565D6D]'
              )
            }
          >Profession 1</Tab>
          {
            isComplete &&
            <Tab
              key="Profession2"
              onClick={() => setProfessional(2)}
              className={({ selected }) =>
                cn(
                  'w-full py-2.5 text-sm font-medium leading-5 ',
                  'focus:outline-none focus:ring-0',
                  selected
                    ? 'bg-transparent text-primary border-b-2 border-primary stroke-primary'
                    : 'text-[#565D6D] hover:bg-white/[0.12] hover:text-white stroke-[#565D6D]'
                )
              }
            >Profession 2</Tab>
          }
        </Tab.List>
        <Tab.Panels className="mt-2 !overflow-x-hidden">
          <Tab.Panel
            key="Profession1"
            className={cn(
              'bg-transparent !overflow-x-hidden',
            )}
          >
            <Suspense fallback={<Loader backdrop content="loading..." vertical />}>
              <Profesi
                formRef={formRef}
                defaultData={defaultData}
                setDefaultData={setDefaultData}
                data={data}
                handleConfirm={handleConfirm}
                handleOpenGallery={handleOpenGallery}
                handleOpenPreview={handleOpenPreview}
                fileImages={fileImages}
                status={status}
                uploading={uploading}
                isType={isType}
                renderMenuGroup={renderMenuGroup}
                renderMenuItem={renderMenuItem}
                handleOpenUpdateInfo={handleOpenUpdateInfo}
                handleOpenDeleteService={handleOpenDeleteService}
                handleOpenUpdateService={handleOpenUpdateService}
                stats={stats}
                load={load}
                service={service}
                navigate={navigate}
                professional={professional}
                handleSubmit={handleSubmit}
                handleSubmitType={handleSubmitType}
              // handleType={handleType}
              />
            </Suspense>
          </Tab.Panel>
          {
            isComplete &&
            <Tab.Panel
              key="Profession2"
              className={cn(
                'bg-transparent !overflow-x-hidden',
              )}
            >
              <Suspense fallback={<Loader backdrop content="loading..." vertical />}>
                <Profesi
                  formRef={formRef}
                  defaultData={defaultData}
                  setDefaultData={setDefaultData}
                  data={data}
                  handleConfirm={handleConfirm}
                  handleOpenGallery={handleOpenGallery}
                  handleOpenPreview={handleOpenPreview}
                  fileImages={fileImages}
                  status={status}
                  uploading={uploading}
                  isType={isType}
                  renderMenuGroup={renderMenuGroup}
                  renderMenuItem={renderMenuItem}
                  handleOpenUpdateInfo={handleOpenUpdateInfo}
                  handleOpenDeleteService={handleOpenDeleteService}
                  handleOpenUpdateService={handleOpenUpdateService}
                  stats={stats}
                  load={load}
                  service={service}
                  navigate={navigate}
                  professional={professional}
                  handleSubmit={handleSubmit}
                  handleSubmitType={handleSubmitType}
                // handleType={handleType}
                />
              </Suspense>
            </Tab.Panel>
          }
        </Tab.Panels>
      </Tab.Group>

      {/* Add and Update Stat */}
      <Modal backdrop="static" open={openUpdateInfo} onClose={handleCloseUpdateInfo} size={"sm"} autoFocus={false}>
        <Modal.Header>
          <Modal.Title>Manage Stat</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form
            ref={formStatRef}
            fluid
          >
            <Form.Group controlId="stat">
              <Form.ControlLabel>Stat</Form.ControlLabel>
              {stats?.map((item, index) => (
                <div className="mb-3 flex gap-2 align-items-center" key={index}>
                  <Form.Control
                    required
                    name="title"
                    disabled={load}
                    placeholder="Title"
                    value={item.title}
                    onChange={(value, e) => handleStatTempChange(index, value, e)}
                  />
                  <Form.Control
                    required
                    name="value"
                    disabled={load}
                    placeholder="Value"
                    value={item.value}
                    onChange={(value, e) => handleStatTempChange(index, value, e)}
                  />
                  <Button className="!bg-primary-Red !text-white" onClick={() => removeStatTemp(index)} loading={load}>
                    Delete
                  </Button>
                </div>
              )
              )}
              <Button className="!bg-primary-Yellow" onClick={addStatTemp} loading={load}>
                Add Stat
              </Button>
            </Form.Group>

            <div className="flex justify-center mt-10 mb-5">
              <Button appearance="primary" className={`!rounded-full !px-16 !py-2`} loading={load} type="submit" onClick={handleStat}>Save</Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Update Service */}
      <Modal backdrop="static" open={openUpdateService} onClose={handleCloseUpdateService} size={"lg"}>
        <Modal.Header>
          <Modal.Title>Update Service</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form
            ref={formServiceRef}
            onChange={setFormValue}
            formValue={formValue}
            model={modelService}
            fluid
            className="flex flex-col mt-5"
          >
            <Form.Group controlId='name' className="!mb-4 grow !flex !items-center">
              <Form.ControlLabel className="min-w-[6.6rem]">Service Name</Form.ControlLabel>
              <Form.Control accepter={SelectPicker} data={serviceList} onOpen={updateDataService} renderMenu={renderMenu} searchable={false} value={formValue?.name} defaultValue={formValue?.name} name="name" errorPlacement="bottomEnd" className="!py-2 !w-full !rounded-lg !bg-[#1C1A1A] focus:!ring-0 focus:!border-0 !text-white" />
            </Form.Group>
            <Form.Group controlId='desc' className="!mb-4 grow">
              <Form.ControlLabel className="min-w-[6.6rem]">Bio</Form.ControlLabel>
              <Form.Control name="desc" accepter={Textarea} placeholder='e.g portraits, fashion, editorial, or' autoComplete="off" errorPlacement="bottomEnd" className="!py-2 !pe-0 !ps-2 !block !w-full !rounded-none !bg-transparent !border-t-transparent !border-b-2 !border-x-transparent !border-b-gray-200 !text-sm focus:!border-t-transparent focus:!border-x-transparent focus:!border-b-blue-500 focus:!ring-0 disabled:!opacity-50 disabled:!pointer-events-none dark:!border-b-neutral-700 dark:!text-neutral-400 dark:!placeholder-neutral-500 dark:!focus:ring-neutral-600 dark:!focus:border-b-neutral-600" />
            </Form.Group>
            <Form.Group controlId='type_fee' className="!mb-4 grow !flex !items-center">
              <Form.ControlLabel className="min-w-[6.6rem]">Fee</Form.ControlLabel>
              <div className="flex gap-2">
                <Form.Control accepter={SelectPicker} data={dataFee} searchable={false} name="type_fee" className="!py-2 !w-full !rounded-lg !bg-[#1C1A1A] focus:!ring-0 focus:!border-0 !text-white" />
                <Form.Control name="fee" value={formValue?.fee?.toString()} defaultValue={formValue?.fee?.toString()} placeholder='100000' autoComplete="off" className="!py-2 !pe-0 !block !w-full !rounded-none !bg-transparent !border-t-transparent !border-b-2 !border-x-transparent !border-b-gray-200 !text-sm focus:!border-t-transparent focus:!border-x-transparent focus:!border-b-blue-500 focus:!ring-0 disabled:!opacity-50 disabled:!pointer-events-none dark:!border-b-neutral-700 dark:!text-neutral-400 dark:!placeholder-neutral-500 dark:!focus:ring-neutral-600 dark:!focus:border-b-neutral-600" />
              </div>
            </Form.Group>
            <Form.Group controlId='duration' className="!mb-4 grow !flex !items-center">
              <Form.ControlLabel className="min-w-[6.6rem]">Duration</Form.ControlLabel>
              <div className="flex items-center gap-1">
                <Form.Control accepter={SelectPicker} data={dataDurationHour} name="duration_hour" className="!py-2 !w-[100%] !rounded-lg !bg-[#1C1A1A] focus:!ring-0 focus:!border-0 !text-white" searchable={false} />
                <p>hour</p>
                <Form.Control accepter={SelectPicker} data={dataDurationMinute} name="duration_minute" className="!py-2 !w-[100%] !rounded-lg !bg-[#1C1A1A] focus:!ring-0 focus:!border-0 !text-white" searchable={false} />
                <p>minute</p>
              </div>
            </Form.Group>
            <Form.Group controlId='downpayment' className="!mb-4 grow !flex !items-center">
              <Form.ControlLabel className="min-w-[6.6rem]">Downpayment</Form.ControlLabel>
              <div className="flex items-center gap-1">
                <Form.Control accepter={SelectPicker} data={dataDownpayment} searchable={false} name="downpayment" className="!py-2 !w-[100%] !rounded-lg !bg-[#1C1A1A] focus:!ring-0 focus:!border-0 !text-white" />
              </div>
            </Form.Group>
            <Form.Group controlId='finalpayment' className="!mb-4 grow !flex !items-center">
              <Form.ControlLabel className="min-w-[6.6rem]">Final Payment</Form.ControlLabel>
              <div className="flex items-center gap-1">
                <Form.Control accepter={InputNumber} min={0} defaultValue={formValue.finalpayment} formatter={value => `${value} before the event`} name="finalpayment" errorPlacement="bottomEnd" className="!rounded-lg !bg-[#1C1A1A] focus:!ring-0 focus:!border-0 !text-white" />
              </div>
            </Form.Group>

            <div className="flex justify-between mt-8">
              <div className="flex flex-col gap-2 w-[580vw]">
                <p>Hide Fees in Profile</p>
                <p className="text-sm text-[#9095A1]">(If its hidden, fee will be revealed upon booking)</p>
              </div>
              <Form.Control accepter={Toggle} name="hide" size="md" defaultValue={Number(formValue?.hide) === 1 ? true : false} />
            </div>

            <div className="flex justify-center mt-10 mb-5">
              <Button appearance="primary" type="submit" onClick={handleService} loading={load} className={`!rounded-full !px-16 !py-2`}>Save</Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Delete Service */}
      <Modal backdrop="static" role="alertdialog" open={openDeleteService} onClose={handleCloseDeleteService} size="md">
        <Modal.Body>
          <TfiAlert style={{ color: '#ffb300', fontSize: 24 }} />
          Are you sure want to delete this service?
        </Modal.Body>
        <Modal.Footer>
          <Button className='bg-red-500 !text-white' color="red" onClick={handleDeleteService} loading={load} appearance="primary">
            Delete
          </Button>
          <Button className='bg-slate-100' onClick={handleCloseDeleteService} appearance="subtle" disabled={load}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Gallery */}
      <Modal backdrop="static" open={openGallery} onClose={handleCloseGallery} size={"sm"}>
        <Modal.Header>
          <Modal.Title>Upload Gallery</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form encType="multipart/form-data" fluid>
            <Form.Control
              accepter={Uploader}
              accept="image/png, image/jpeg, image/jpg"
              action="#"
              disabled={uploading}
              name="image"
              draggable
              fileListVisible={false}
              onUpload={(file) => {
                previewFile(file.blobFile, value => {
                  setInfoImage(value);
                });
                setFileImages({ ...fileImages, image: file.blobFile })
              }}
            >
              <div>
                {uploading && <Loader backdrop center />}
                {infoImage
                  ? (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <img src={infoImage} alt="image" width={200} height={200} />
                    </div>
                  )
                  : (
                    <div style={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <span>Click or Drag files to this area to upload</span>
                    </div>
                  )}
              </div>
            </Form.Control>

            <div className="flex justify-center mt-10 mb-5">
              <Button appearance="primary" className={`!rounded-full !px-16 !py-2`} loading={uploading} type="submit" onClick={uploadImage}>Save</Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Preview Image */}
      <Modal open={openPreview} onClose={handleClosePreview} size={"sm"}>
        <Modal.Header>
          <Modal.Title>Preview Image</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="flex gap-2 mb-3">
            <Button appearance="primary" className={`!rounded-full !px-16 !py-2`} onClick={() => handleOpenGallery(previewImage.pos)}>Update Image</Button>
            <Button appearance="primary" className={`!rounded-full !px-16 !py-2`} onClick={() => handleOpenDeleteImage(previewImage.pos)}>Delete Image</Button>
          </div>
          <div
            onClick={() => handleOpenGallery(previewImage.pos)}
            className="!cursor-pointer w-fit mx-auto"
          >
            {
              status === "success" ?
                <div style={{ backgroundColor: "#151617", position: "relative", overflow: "hidden" }}>
                  {uploading && <Loader backdrop center />}
                  <LazyLoadImage effect='blur'
                    className="flex mx-auto"
                    src={previewImage.image}
                    alt="image"
                  />
                  <div className="absolute w-full h-full flex justify-center items-center cursor-pointer top-0 left-0 bg-[#151617] opacity-0 z-[50] transition-opacity duration-300 hover:opacity-60">
                    <svg width="33" height="33" viewBox="0 0 33 33" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect x="1" y="1" width="31" height="31" rx="15.5" stroke="#C3F500" />
                      <g clipPath="url(#clip0_348_543)">
                        <path d="M15.7084 15.7084L15.7084 10.9584L17.2917 10.9584L17.2917 15.7084L22.0417 15.7084L22.0417 17.2917L17.2917 17.2917L17.2917 22.0417L15.7084 22.0417L15.7084 17.2917L10.9584 17.2917L10.9584 15.7084L15.7084 15.7084Z" fill="#C3F500" />
                      </g>
                      <defs>
                        <clipPath id="clip0_348_543">
                          <rect width="19" height="19" fill="white" transform="translate(7 7)" />
                        </clipPath>
                      </defs>
                    </svg>
                  </div>
                </div>
                :
                <Placeholder.Graph active style={{ backgroundColor: "#151617", borderRadius: "300px", borderBottomRightRadius: "0px", borderBottomLeftRadius: "380px", position: "relative", overflow: "hidden" }} />
            }
          </div>
        </Modal.Body>
      </Modal>

      {/* Confirm fill */}
      {/* <Modal backdrop="static" role="alertdialog" open={openFill} onClose={handleCloseFill} size="sm" className="!z-[999999999999]">
        <Modal.Body>
          <TfiAlert style={{ color: '#ffb300', fontSize: 24 }} />
          Please enter your {fillTitle} <a href={fillLink}>in here</a>.
        </Modal.Body>
        <Modal.Footer>
          <Button className='bg-slate-100' onClick={handleCloseFill} appearance="subtle">
            Cancel
          </Button>
        </Modal.Footer>
      </Modal> */}

      {/* Confirm choose type */}
      <Modal role="alertdialog" open={openConfirm} onClose={handleCloseConfirm} size="sm">
        <Modal.Body>
          <TfiAlert style={{ color: '#ffb300', fontSize: 24 }} />
          You should choose type of profession first
        </Modal.Body>
        <Modal.Footer>
          <Button className='bg-slate-100' onClick={handleCloseConfirm} appearance="subtle">
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Delete Image */}
      <Modal backdrop="static" role="alertdialog" open={openDeleteImage} onClose={!uploading && handleCloseDeleteImage} size="sm">
        <Modal.Body>
          <TfiAlert style={{ color: '#ffb300', fontSize: 24 }} />
          Are you sure want to delete this image?
        </Modal.Body>
        <Modal.Footer>
          <Button className='bg-red-500 !text-white' color="red" onClick={deleteImage} loading={uploading} appearance="primary">
            Delete
          </Button>
          <Button className='bg-slate-100' onClick={handleCloseDeleteImage} appearance="subtle" disabled={uploading}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </Onboarding>
  )
}

export default Index