import {
  Box,
  Typography,
  Tabs,
  Tab,
  Button,
  TextField,
  IconButton,
  Divider,
  styled,
} from "@mui/material";
import useAccount from "../../hooks/Candidate/Account/useAccount";
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
import {
  Timeline,
  TimelineItem,
  timelineItemClasses,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
} from '@mui/lab';
import useFiles from "../../hooks/Files/useFiles";
import ModalDataPersonal from "../../components/candidate/Modals/ModalDataPersonal";
import ModalDataExperience from "../../components/candidate/Modals/ModalDataExperience";
import ModalDataStudies from "../../components/candidate/Modals/ModalDataStudies";
import ModalDataLanguage from "../../components/candidate/Modals/ModalDataLanguage";

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
  const [experiencesData, setExperiencesData] = useState<any>([]);
  const [studiesData, setStudiesData] = useState<any>([]);
  const [languagesData, setLanguagesData] = useState<any>([]);
  const { uploadFile } = useFiles();
  const userInfo = localStorage.getItem("userInfo");
  const userInfoJson = JSON.parse(userInfo || "{}");
  const { getExperienceInformation, getStudiesInformation, getLanguagesInformation } = useAccount();

  const handleOpenModalEditDataPersonal = async () => {
    setOpenModalDataPersonal(true);
  };

  const handleCloseModalEditDataPersonal = () => {
    setOpenModalDataPersonal(false);
  };

  const handleCloseModalEditDataExperience = () => {
    setOpenModalExperience(false);
  }

  const handleCloseModalEditDataStudies = () => {
    setOpenModalStudy(false);
  }

  const handleCloseModalEditDataLanguage = () => {
    setOpenModalLanguage(false);
  }

  //TABS
  const handleChange = (_e: any, newValue: number) => {
    setTabValue(newValue);
  };

  //TAB EXPERIENCE
  const handleGetExperiences = async () => {
    //HARÁ LA PETICIÓN PARA LISTAR LAS EXPERIENCIAS
    const repsonse = await getExperienceInformation(userInfoJson?.id_user);
    setExperiencesData(repsonse.response.data);
    console.log(repsonse.response.data)
  }

  const handleGetStudies = async () => {
    //HARÁ LA PETICIÓN PARA LISTAR LOS ESTUDIOS
    const response = await getStudiesInformation(userInfoJson?.id_user);
    setStudiesData(response.response.studies);
    console.log(response.response.studies)
  }

  const handleGetLanguages = async () => {
    //HARÁ LA PETICIÓN PARA LISTAR LOS IDIOMAS
    const response = await getLanguagesInformation(userInfoJson?.id_user);
    setLanguagesData(response.response.data);
    console.log(response.response.data)
  }

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
                onClick={(e) => {
                  handleChange(e, 1)
                  handleGetExperiences()
                }}
              />
              <Tab
                value={2}
                label="Educación"
                onClick={(e) => {
                  handleChange(e, 2)
                  handleGetStudies()
                  handleGetLanguages()
                }}
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

            <Box>
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
                <Box>
                  {experiencesData.map((experience: any) => (
                    <Timeline
                      key={experience.id}
                      sx={{
                        //ALINEAR A LA IZQUIERDA
                        [`& .${timelineItemClasses.root}:before`]: {
                          flex: 0,
                          padding: 6,
                        },
                      }}
                    >
                      <TimelineItem>
                        <TimelineSeparator>
                          <TimelineDot />
                          <TimelineConnector />
                        </TimelineSeparator>
                        <TimelineContent>
                          <Box
                            mt={2}
                            p={2}
                            borderRadius={4}
                            width={"70%"}
                            display={"flex"}
                            flexDirection={"column"}
                            gap={"1rem"}
                            margin={"0"}
                            padding={"0.7rem  "}
                          >
                            <Box>
                              <Typography variant="body1">
                                <strong> {experience.cargo}</strong>
                              </Typography>
                              <Typography variant="body1" color={"#808080"}>
                                {experience.empresa}
                              </Typography>
                            </Box>
                            <Typography variant="body1">
                              {experience.funciones}
                            </Typography>
                            <Typography>
                              <strong>Periodo: </strong> {experience.anio_inicio} - {experience.anio_fin}
                            </Typography>
                          </Box>
                        </TimelineContent>
                      </TimelineItem>
                    </Timeline>
                  ))}
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
                <Box>
                  {studiesData.map((study: any) => (
                    <Timeline
                      key={study.id}
                      sx={{
                        //ALINEAR A LA IZQUIERDA
                        [`& .${timelineItemClasses.root}:before`]: {
                          flex: 0,
                          padding: 6,
                        },
                      }}
                    >
                      <TimelineItem>
                        <TimelineSeparator>
                          <TimelineDot />
                          <TimelineConnector />
                        </TimelineSeparator>
                        <TimelineContent>
                          <Box
                            mt={2}
                            p={2}
                            borderRadius={4}
                            width={"70%"}
                            display={"flex"}
                            flexDirection={"column"}
                            gap={"1rem"}
                            margin={"0"}
                            padding={"0.7rem"}
                          >
                            <Box>
                              <Typography variant="body1">
                                <strong> {study.titulo}</strong>
                              </Typography>
                              <Typography variant="body1" color={"#808080"}>
                                {study.institucion}
                              </Typography>
                              <Typography variant="body1">
                                {study.descripcion}
                              </Typography>
                            </Box>
                            <Typography>
                              <strong>Periodo: </strong> {study.fechaInicio} - {study.fechaFin}
                            </Typography>
                          </Box>
                        </TimelineContent>
                      </TimelineItem>
                    </Timeline>
                  ))}
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
                  <Box>
                    {languagesData.map((language: any) => (
                      <Timeline
                        key={language.id}
                        sx={{
                          //ALINEAR A LA IZQUIERDA
                          [`& .${timelineItemClasses.root}:before`]: {
                            flex: 0,
                            padding: 6,
                          },
                        }}
                      >
                        <TimelineItem>
                          <TimelineSeparator>
                            <TimelineDot />
                            <TimelineConnector />
                          </TimelineSeparator>
                          <TimelineContent>
                            <Box
                              mt={2}
                              p={2}
                              borderRadius={4}
                              width={"70%"}
                              display={"flex"}
                              flexDirection={"column"}
                              gap={"1rem"}
                              margin={"0"}
                              padding={"0.7rem"}
                            >
                              <Box>
                                <Typography variant="body1">
                                  <strong> {language.idioma}</strong>
                                </Typography>
                                <Typography variant="body1" color={"#808080"}>
                                  {language.nivel}
                                </Typography>
                              </Box>
                            </Box>
                          </TimelineContent>
                        </TimelineItem>
                      </Timeline>
                    ))}
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>
        )}
      </Box>

      <ModalDataPersonal openModalDataPersonal={openModalDataPersonal} handleCloseModalEditDataPersonal={handleCloseModalEditDataPersonal} />
      <ModalDataExperience openModalExperience={openModalExperience} handleCloseModalEditDataExperience={handleCloseModalEditDataExperience} onExperienceSaved={async () => {
        await handleGetExperiences();
      }} />
      <ModalDataStudies openModalStudy={openModalStudy} handleCloseModalEditDataStudies={handleCloseModalEditDataStudies} onStudtySave={
        async () => {
          await handleGetStudies();
        }
      } />
      <ModalDataLanguage openModalLanguage={openModalLanguage} handleCloseModalEditDataLanguage={handleCloseModalEditDataLanguage} onLanguageSave={
        async () => {
          await handleGetLanguages();
        }
      } />
    </>
  );
};

export default MyCV;
