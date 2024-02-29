import {
  Box,
  Typography,
  Tabs,
  Tab,
  Button,
  Modal,
  TextField,
  IconButton,
  Divider,
  FormControl,
  styled,
  InputLabel,
  Select,
  MenuItem,
  Autocomplete,
} from "@mui/material";

import theme from "../../../theme";
import HeaderButtons from "../../components/candidate/HeaderButtons";
import { useEffect, useState } from "react";
import {
  Add,
  CloudUpload,
  DeleteOutline,
  LocationOnOutlined,
  MailOutline,
  PhoneOutlined,
} from "@mui/icons-material";
import useFiles from "../../hooks/Files/useFiles";
import useAccount from "../../hooks/Candidate/Account/useAccount";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

const MyCV = () => {
  const [tabValue, setTabValue] = useState(0);
  const [openModalDataPersonal, setOpenModalDataPersonal] = useState(false);
  const [openModalExperience, setOpenModalExperience] = useState(false);
  const [openModalStudy, setOpenModalStudy] = useState(false);
  const [openModalLanguage, setOpenModalLanguage] = useState(false);
  const [selectedFile, setSelectedFile] = useState<any>(null);
  const [personalInfoEdit, setPersonalInfoEdit] = useState({});
  const [selectedOptionDocumentType, setSelectedOptionDocumentType] = useState<string | null>(null);
  const { uploadFile } = useFiles();
  const userInfo = localStorage.getItem("userInfo");
  const userInfoJson = JSON.parse(userInfo || "{}");
  const { getPersonalInformation } = useAccount();

  const handleOpenModalEditDataPersonal = async () => {
    //HARÁ LA PETICIÓN
    setOpenModalDataPersonal(true);
    const response = await getPersonalInformation(userInfoJson?.id_user);
    const userPersonalInfo = response.response.data;
    setPersonalInfoEdit(userPersonalInfo);
    console.log(userPersonalInfo)
  };

  const convertStateToNumber = () => {

    const state = (personalInfoEdit as { estado_civil: string })?.estado_civil;

    switch (state) {
      case "Soltero":
        return 1;
      case "Viudo":
        return 2;
      case "Casado":
        return 3;
      default:
        return;
    }
  }

  const handleCloseModalEditDataPersonal = () => {
    setOpenModalDataPersonal(false);
  };

  const handleChange = (_e: any, newValue: number) => {
    setTabValue(newValue);
  };

  const handleFileChange = async (event: any) => {
    const file = event.target.files[0];
    const userId = userInfoJson?.id_user;
    if (file) {
      setSelectedFile({ name: file.name, size: file.size });

      console.log(file, userId)

      const response = await uploadFile(file, userId);
      console.log(response);

      localStorage.setItem('selectedFileDetails', JSON.stringify({
        name: file.name,
        size: file.size
      }));
    }

    event.target.value = ''; // Reset input value
  };

  const handleDeleteFile = () => {
    setSelectedFile(null);
    localStorage.removeItem('selectedFileDetails');
  };

  const formatFileSize = (sizeInBytes: number) => {
    const kilobyte = 1024;
    const megabyte = kilobyte * 1024;

    if (sizeInBytes > megabyte) {
      return (sizeInBytes / megabyte).toFixed(2) + " MB";
    } else if (sizeInBytes > kilobyte) {
      return (sizeInBytes / kilobyte).toFixed(2) + " KB";
    } else {
      return sizeInBytes + " bytes";
    }
  };

  const handleSubmitEmail = (event: any) => {
    event.preventDefault();
    //handleCloseModalEditDataPersonal();

    const formData = new FormData(event.target);
    console.log("formData")

  };

  useEffect(() => {
    const fileDetails = localStorage.getItem('selectedFileDetails');
    if (fileDetails) {
      setSelectedFile(JSON.parse(fileDetails));
    }
  }, []);

  return (
    <>
      <HeaderButtons showLogo={true} />
      <Box
        // maxWidth="xxl"
        sx={{
          display: "flex",
          flexDirection: "column",
          marginTop: "2rem",
          marginBottom: "2rem",
          rowGap: "2rem",
          border: "1px solid #a7a7a7",
          backgroundColor: "white",
          padding: "1rem",
          width: "100%",
          maxWidth: "95%",
          margin: "auto",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            rowGap: "1rem",
          }}
        >
          <Box sx={{ width: "100%", borderBottom: "1px solid #a7a7a7" }}>
            <Tabs value={tabValue} variant="scrollable" scrollButtons="auto">
              <Tab
                value={0}
                label="Datos personales"
                onClick={(e) => handleChange(e, 0)}
              />
              <Tab
                value={1}
                label="Experiencia"
                onClick={(e) => handleChange(e, 1)}
              />
              <Tab
                value={2}
                label="Educación"
                onClick={(e) => handleChange(e, 2)}
              />
            </Tabs>
          </Box>
        </Box>

        {/* Cuadro segun tab */}
        {tabValue === 0 && (
          <Box
            sx={{
              //   boxShadow: 3,
              padding: "1rem",
              marginTop: "1rem",
              display: "flex",
              flexDirection: "column",
              rowGap: "2rem",
            }}
          >
            <Typography variant="h5" gutterBottom>
              {userInfoJson?.nombresC} {userInfoJson?.apellidosC}
            </Typography>

            <Box
              display="flex"
              alignItems="start"
              gap={"2rem"}
              sx={{
                [theme.breakpoints.down("sm")]: {
                  flexDirection: "column",
                  gap: "1rem",
                },
              }}
            >
              <img
                src="https://fotosprofesionales.es/wp-content/uploads/2023/08/fotografo-de-retrato-madrid-foto-corporativa-hombre-12.jpg"
                alt="avatar"
                style={{
                  width: "8rem",
                  height: "10rem",
                  cursor: "pointer",
                }}
              />

              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  rowGap: "0.5rem",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <IconButton>
                    <MailOutline
                      sx={{
                        fontSize: "2rem",
                      }}
                    />
                  </IconButton>
                  <Typography
                    variant="body1"
                    gutterBottom
                    sx={{
                      marginBottom: "0",
                    }}
                  >
                    {userInfoJson?.emailCandidate}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <IconButton>
                    <PhoneOutlined
                      sx={{
                        fontSize: "2rem",
                      }}
                    />
                  </IconButton>
                  <Typography
                    variant="body1"
                    gutterBottom
                    sx={{
                      marginBottom: "0",
                    }}
                  >
                    NO DEFINIDO
                  </Typography>
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <IconButton>
                    <LocationOnOutlined
                      sx={{
                        fontSize: "2rem",
                      }}
                    />
                  </IconButton>
                  <Typography
                    variant="body1"
                    gutterBottom
                    sx={{
                      marginBottom: "0",
                    }}
                  >
                    NO DEFINIDO
                  </Typography>
                </Box>
              </Box>

              <Button
                variant="outlined"
                color="primary"
                onClick={handleOpenModalEditDataPersonal}
              >
                Editar
              </Button>
            </Box>

            <Button
              variant="contained"
              component="label"
              color="primary"
              startIcon={<CloudUpload />}
              disabled={!!selectedFile}
              sx={{
                width: "fit-content",
                [theme.breakpoints.down("sm")]: {
                  width: "100%",
                },
              }}
            >
              Cargar CV
              <VisuallyHiddenInput
                type="file"
                onChange={handleFileChange}
                accept=".pdf"
                id="fileInputCV"
              />
            </Button>
            <Typography
              sx={{
                color: "gray",
                fontSize: "1rem",
              }}
            >
              * El documento sustentatorio va ser remitido en el proceso o etapa de la entrevista
            </Typography>

            {selectedFile && (
              <Box
                mt={2}
                p={2}
                borderRadius={4}
                sx={{
                  borderRadius: "0.5rem",
                  border: "1px solid #0d3878",
                  position: "relative",
                }}
              >
                <Typography variant="subtitle1" fontWeight="bold">
                  CV Cargado:
                </Typography>
                <Typography variant="body1">
                  <strong>Nombre:</strong> {selectedFile.name}
                </Typography>
                <Typography variant="body1">
                  <strong>Tamaño:</strong> {formatFileSize(selectedFile.size)}
                </Typography>

                <IconButton
                  onClick={handleDeleteFile}
                  sx={{
                    position: "absolute",
                    top: 10,
                    right: 10,
                  }}
                >
                  <DeleteOutline />
                </IconButton>
              </Box>
            )}
          </Box>
        )}

        {tabValue === 1 && (
          <Box
            sx={{
              padding: "1rem",
              marginTop: "1rem",
              display: "flex",
              flexDirection: "column",
              rowGap: "2rem",
            }}
          >
            <Typography variant="h5" gutterBottom>
              {userInfoJson?.nombresC} {userInfoJson?.apellidosC}
            </Typography>

            <Box
              display="flex"
              alignItems="start"
              gap={"2rem"}
              sx={{
                [theme.breakpoints.down("sm")]: {
                  flexDirection: "column",
                  gap: "1rem",
                },
              }}
            >
              <img
                src="https://fotosprofesionales.es/wp-content/uploads/2023/08/fotografo-de-retrato-madrid-foto-corporativa-hombre-12.jpg"
                alt="avatar"
                style={{
                  width: "8rem",
                  height: "10rem",
                  cursor: "pointer",
                }}
              />

              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  rowGap: "0.5rem",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    [theme.breakpoints.down("sm")]: {
                      flexDirection: "column",
                    },
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <IconButton>
                      <MailOutline
                        sx={{
                          fontSize: "2rem",
                        }}
                      />
                    </IconButton>
                    <Typography
                      variant="body1"
                      gutterBottom
                      sx={{
                        marginBottom: "0",
                      }}
                    >
                      {userInfoJson?.emailCandidate}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <IconButton>
                      <PhoneOutlined
                        sx={{
                          fontSize: "2rem",
                        }}
                      />
                    </IconButton>
                    <Typography
                      variant="body1"
                      gutterBottom
                      sx={{
                        marginBottom: "0",
                      }}
                    >
                      NO DEFINIDO
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <IconButton>
                      <LocationOnOutlined
                        sx={{
                          fontSize: "2rem",
                        }}
                      />
                    </IconButton>
                    <Typography
                      variant="body1"
                      gutterBottom
                      sx={{
                        marginBottom: "0",
                      }}
                    >
                      NO DEFINIDO
                    </Typography>
                  </Box>
                </Box>

                <TextField
                  label="Descripción del perfil"
                  variant="outlined"
                  multiline
                  fullWidth
                  placeholder="Escribe una descripción de tu perfil"
                  rows={3}
                />
              </Box>
            </Box>

            <Box sx={{}}>
              <Typography variant="h5" gutterBottom>
                Experiencia laboral
              </Typography>
              <Divider />
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  rowGap: "1rem",
                  marginTop: "1rem",
                }}
              >
                <Typography
                  gutterBottom
                  sx={{
                    fontSize: "1.2rem",
                  }}
                >
                  Mis experiencias profesionales
                </Typography>
                <Box>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      columnGap: "1rem",
                    }}
                  >
                    <Button
                      variant="outlined"
                      endIcon={<Add />}
                      onClick={() => setOpenModalExperience(true)}
                    >
                      Agregar experiencia
                    </Button>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>
        )}

        {tabValue === 2 && (
          <Box
            sx={{
              padding: "1rem",
              marginTop: "1rem",
              display: "flex",
              flexDirection: "column",
              rowGap: "2rem",
            }}
          >
            <Typography variant="h5" gutterBottom>
              {userInfoJson?.nombresC} {userInfoJson?.apellidosC}
            </Typography>

            <Box
              display="flex"
              alignItems="start"
              gap={"2rem"}
              sx={{
                [theme.breakpoints.down("sm")]: {
                  flexDirection: "column",
                  gap: "1rem",
                },
              }}
            >
              <img
                src="https://fotosprofesionales.es/wp-content/uploads/2023/08/fotografo-de-retrato-madrid-foto-corporativa-hombre-12.jpg"
                alt="avatar"
                style={{
                  width: "8rem",
                  height: "10rem",
                  cursor: "pointer",
                }}
              />

              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  rowGap: "0.5rem",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    [theme.breakpoints.down("sm")]: {
                      flexDirection: "column",
                    },
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <IconButton>
                      <MailOutline
                        sx={{
                          fontSize: "2rem",
                        }}
                      />
                    </IconButton>
                    <Typography
                      variant="body1"
                      gutterBottom
                      sx={{
                        marginBottom: "0",
                      }}
                    >
                      luis_de_tomas@gmail.com
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <IconButton>
                      <PhoneOutlined
                        sx={{
                          fontSize: "2rem",
                        }}
                      />
                    </IconButton>
                    <Typography
                      variant="body1"
                      gutterBottom
                      sx={{
                        marginBottom: "0",
                      }}
                    >
                      NO DEFINIDO
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <IconButton>
                      <LocationOnOutlined
                        sx={{
                          fontSize: "2rem",
                        }}
                      />
                    </IconButton>
                    <Typography
                      variant="body1"
                      gutterBottom
                      sx={{
                        marginBottom: "0",
                      }}
                    >
                      NO DEFINIDO
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Box>

            <Box sx={{}}>
              <Typography variant="h5" gutterBottom>
                Formación académica
              </Typography>
              <Divider />
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  rowGap: "1rem",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    rowGap: "1rem",
                    marginTop: "1rem",
                  }}
                >
                  <Typography
                    gutterBottom
                    sx={{
                      fontSize: "1.2rem",
                    }}
                  >
                    Mis Estudios
                  </Typography>
                  <Box>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        columnGap: "1rem",
                      }}
                    >
                      <Button
                        variant="outlined"
                        endIcon={<Add />}
                        onClick={() => setOpenModalStudy(true)}
                      >
                        Agregar estudio
                      </Button>
                    </Box>
                  </Box>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    rowGap: "1rem",
                    marginTop: "1rem",
                  }}
                >
                  <Typography
                    gutterBottom
                    sx={{
                      fontSize: "1.2rem",
                    }}
                  >
                    Idiomas
                  </Typography>
                  <Box>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        columnGap: "1rem",
                      }}
                    >
                      <Button
                        variant="outlined"
                        endIcon={<Add />}
                        onClick={() => setOpenModalLanguage(true)}
                      >
                        Agregar idioma
                      </Button>
                    </Box>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>
        )}
      </Box>

      <Modal
        open={openModalDataPersonal}
        onClose={handleCloseModalEditDataPersonal}
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "900px",
            bgcolor: "background.paper",
            boxShadow: 24,
            padding: "2rem",
            paddingBlock: "3rem",
            [theme.breakpoints.down("sm")]: {
              width: "95%",
              padding: "1rem",
              paddingBlock: "2rem",
            },
          }}
        >
          <Typography variant="h6" id="modal-title" gutterBottom align="left">
            Datos personal y de contacto
          </Typography>
          <Divider />
            <FormControl
              onSubmit={handleSubmitEmail}
              style={{
                display: "flex",
                flexDirection: "column",
                rowGap: "1.5rem",
                marginTop: "1rem",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  columnGap: "1rem",
                  alignItems: "center",
                }}
              >
                <TextField
                  label="Nombres"
                  variant="outlined"
                  margin="normal"
                  defaultValue={(personalInfoEdit as { nombre: string })?.nombre}
                  fullWidth
                />
                <TextField
                  label="Apellidos"
                  variant="outlined"
                  margin="normal"
                  defaultValue={(personalInfoEdit as { apellidos: string })?.apellidos}
                  fullWidth
                />
                <Autocomplete
                  fullWidth
                  disableClearable
                  options={['Peruano(a)']}
                  defaultValue="Peruano(a)"
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Nacionalidad"
                      variant="outlined"
                      
                      margin="normal"
                      fullWidth
                    />
                  )}

                />
              </Box>

              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <Typography variant="h6" gutterBottom align="left">
                  Fecha de nacimiento
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    columnGap: "3rem",
                    alignItems: "center",
                    [theme.breakpoints.down("sm")]: {
                      flexDirection: "column",
                      gap: "1rem",
                    },
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      width: "100%",
                      columnGap: "1rem",
                    }}
                  >
                    <FormControl
                      sx={{
                        width: "50%",
                      }}
                    >
                      <InputLabel id="select-dia">Dia</InputLabel>
                      <Select
                        labelId="select-dia"
                        id="demo-simple-select"
                        value={1}
                        label="Dia"
                      // onChange={handleChange}
                      >
                        <MenuItem value={1}>1</MenuItem>
                        <MenuItem value={2}>2</MenuItem>
                        <MenuItem value={3}>3</MenuItem>
                      </Select>
                    </FormControl>
                    <FormControl
                      sx={{
                        width: "50%",
                      }}
                    >
                      <InputLabel id="select-mes">Mes</InputLabel>
                      <Select
                        labelId="select-mes"
                        id="demo-simple-select"
                        value={1}
                        label="Mes"
                      // onChange={handleChange}
                      >
                        <MenuItem value={1}>Enero</MenuItem>
                        <MenuItem value={2}>Febrero</MenuItem>
                        <MenuItem value={3}>Marzo</MenuItem>
                      </Select>
                    </FormControl>
                    <FormControl
                      sx={{
                        width: "50%",
                      }}
                    >
                      <InputLabel id="select-anio">Año</InputLabel>
                      <Select
                        labelId="select-anio"
                        id="demo-simple-select"
                        value={1}
                        label="Año"
                      // onChange={handleChange}
                      >
                        <MenuItem value={1}>1995</MenuItem>
                        <MenuItem value={2}>1996</MenuItem>
                        <MenuItem value={3}>1997</MenuItem>
                        <MenuItem value={4}>1998</MenuItem>
                        <MenuItem value={5}>1999</MenuItem>
                        <MenuItem value={6}>2000</MenuItem>
                        <MenuItem value={7}>2001</MenuItem>
                        <MenuItem value={8}>2002</MenuItem>
                      </Select>
                    </FormControl>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      width: "100%",
                      columnGap: "1rem",
                    }}
                  >
                    <FormControl fullWidth>
                      <InputLabel id="select-civil">Estado Civil</InputLabel>
                      <Select
                        labelId="select-civil"
                        id="demo-simple-select"
                        defaultValue={convertStateToNumber()}
                        label="Estado Civil"
                      // onChange={handleChange}
                      >
                        <MenuItem value={1}>Soltero</MenuItem>
                        <MenuItem value={2}>Viudo</MenuItem>
                        <MenuItem value={3}>Casado</MenuItem>
                      </Select>
                    </FormControl>
                  </Box>
                </Box>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  columnGap: "1rem",
                }}
              >
                <Autocomplete
                  fullWidth
                  options={['DNI']}
                  onChange={(event, value) => setSelectedOptionDocumentType(value)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Tipo documento"
                      variant="outlined"
                      margin="normal"
                      fullWidth
                    />
                  )}
                />

                <TextField
                  label="Documento"
                  variant="outlined"
                  margin="normal"
                  disabled={!selectedOptionDocumentType}
                  defaultValue={(personalInfoEdit as { documento: string })?.documento}
                  fullWidth
                />

              </Box>
              <Button type="submit" variant="contained" color="primary">
                Guardar
              </Button>
            </FormControl>
        </Box>
      </Modal>

      <Modal
        open={openModalExperience}
        onClose={() => setOpenModalExperience(false)}
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "900px",
            bgcolor: "background.paper",
            boxShadow: 24,
            padding: "2rem",
            paddingBlock: "3rem",
            [theme.breakpoints.down("sm")]: {
              width: "95%",
              padding: "1rem",
              paddingBlock: "2rem",
            },
          }}
        >
          <Typography variant="h6" id="modal-title" gutterBottom align="left">
            Experiencia laboral
          </Typography>
          <Divider />
          <form
            onSubmit={handleSubmitEmail}
            style={{
              display: "flex",
              flexDirection: "column",
              rowGap: "1.5rem",
              marginTop: "1rem",
            }}
          >
            <TextField
              label="Cargo"
              variant="outlined"
              margin="normal"
              fullWidth
            />

            <TextField
              label="Funciones"
              variant="outlined"
              multiline
              minRows={4}
              fullWidth
            />

            <TextField
              label="Empresa"
              variant="outlined"
              margin="normal"
              fullWidth
            />
            <Box
              sx={{
                display: "flex",
                columnGap: "1rem",
                marginTop: "1rem",
              }}
            >
              <FormControl fullWidth>
                <InputLabel id="select-nacionalidad">Año Inicio</InputLabel>
                <Select
                  labelId="select-nacionalidad"
                  id="demo-simple-select"
                  value={10}
                  label="Nacionalidad"
                // onChange={handleChange}
                >
                  <MenuItem value={10}>2010</MenuItem>
                  <MenuItem value={20}>2011</MenuItem>
                  <MenuItem value={30}>2012</MenuItem>
                </Select>
              </FormControl>

              <FormControl fullWidth>
                <InputLabel id="select-nacionalidad">Año Fin</InputLabel>
                <Select
                  labelId="select-nacionalidad"
                  id="demo-simple-select"
                  value={10}
                  label="Nacionalidad"
                // onChange={handleChange}
                >
                  <MenuItem value={10}>2022</MenuItem>
                  <MenuItem value={20}>2023</MenuItem>
                  <MenuItem value={30}>2024</MenuItem>
                </Select>
              </FormControl>
            </Box>

            <Button type="submit" variant="contained" color="primary">
              Guardar
            </Button>
          </form>
        </Box>
      </Modal>

      <Modal open={openModalStudy} onClose={() => setOpenModalStudy(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "900px",
            bgcolor: "background.paper",
            boxShadow: 24,
            padding: "2rem",
            paddingBlock: "3rem",
            [theme.breakpoints.down("sm")]: {
              width: "95%",
              padding: "1rem",
              paddingBlock: "2rem",
            },
          }}
        >
          <Typography variant="h6" id="modal-title" gutterBottom align="left">
            Agregar estudio
          </Typography>
          <Divider />
          <form
            onSubmit={handleSubmitEmail}
            style={{
              display: "flex",
              flexDirection: "column",
              rowGap: "1.5rem",
              marginTop: "1rem",
            }}
          >
            <TextField
              label="Descripción del titulo"
              variant="outlined"
              multiline
              minRows={4}
              fullWidth
            />

            <TextField
              label="Titulo"
              variant="outlined"
              margin="normal"
              fullWidth
            />

            <TextField
              label="Institución"
              variant="outlined"
              margin="normal"
              fullWidth
            />
            <Box
              sx={{
                display: "flex",
                columnGap: "1rem",
                marginTop: "1rem",
              }}
            >
              <FormControl fullWidth>
                <InputLabel id="select-nacionalidad">Año Inicio</InputLabel>
                <Select
                  labelId="select-nacionalidad"
                  id="demo-simple-select"
                  value={10}
                  label="Nacionalidad"
                // onChange={handleChange}
                >
                  <MenuItem value={10}>2010</MenuItem>
                  <MenuItem value={20}>2011</MenuItem>
                  <MenuItem value={30}>2012</MenuItem>
                </Select>
              </FormControl>

              <FormControl fullWidth>
                <InputLabel id="select-nacionalidad">Año Fin</InputLabel>
                <Select
                  labelId="select-nacionalidad"
                  id="demo-simple-select"
                  value={10}
                  label="Nacionalidad"
                // onChange={handleChange}
                >
                  <MenuItem value={10}>2022</MenuItem>
                  <MenuItem value={20}>2023</MenuItem>
                  <MenuItem value={30}>2024</MenuItem>
                </Select>
              </FormControl>
            </Box>

            <Button type="submit" variant="contained" color="primary">
              Guardar
            </Button>
          </form>
        </Box>
      </Modal>

      <Modal
        open={openModalLanguage}
        onClose={() => setOpenModalLanguage(false)}
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "900px",
            bgcolor: "background.paper",
            boxShadow: 24,
            padding: "2rem",
            paddingBlock: "3rem",
            [theme.breakpoints.down("sm")]: {
              width: "95%",
              padding: "1rem",
              paddingBlock: "2rem",
            },
          }}
        >
          <Typography variant="h6" id="modal-title" gutterBottom align="left">
            Agregar idioma
          </Typography>
          <Divider />
          <FormControl
            component={"form"}
            onSubmit={handleSubmitEmail}
            style={{
              display: "flex",
              flexDirection: "column",
              rowGap: "1.5rem",
              marginTop: "1rem",
            }}
          >
            <Box
              sx={{
                display: "flex",
                columnGap: "1rem",
                marginTop: "1rem",
              }}
            >
              <FormControl fullWidth>
                <InputLabel id="select-nacionalidad">Idioma</InputLabel>
                <Select
                  labelId="select-nacionalidad"
                  id="demo-simple-select"
                  value={10}
                  label="Nacionalidad"
                // onChange={handleChange}
                >
                  <MenuItem value={10}>Español</MenuItem>
                  <MenuItem value={20}>Ingles</MenuItem>
                  <MenuItem value={30}>Alemán</MenuItem>
                </Select>
              </FormControl>

              <FormControl fullWidth>
                <InputLabel id="select-nacionalidad">Nivel</InputLabel>
                <Select
                  labelId="select-nacionalidad"
                  id="demo-simple-select"
                  value={10}
                  label="Nacionalidad"
                // onChange={handleChange}
                >
                  <MenuItem value={10}>Básico</MenuItem>
                  <MenuItem value={20}>Intermedio</MenuItem>
                  <MenuItem value={30}>Avanzado</MenuItem>
                </Select>
              </FormControl>
            </Box>

            <Button type="submit" variant="contained" color="primary">
              Guardar
            </Button>
          </FormControl>
        </Box>
      </Modal>
    </>
  );
};

export default MyCV;
