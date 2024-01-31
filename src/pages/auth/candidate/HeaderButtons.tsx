import { PostAddOutlined, ManageSearchOutlined } from "@mui/icons-material";
import { Avatar, Box, Button, Menu, MenuItem } from "@mui/material";
import { useNavigate } from "react-router-dom";

import theme from "../../../../theme";
import { MouseEvent, useState } from "react";

interface Props {
  isAuthenticated: boolean;
  showLogo?: boolean;
}

const HeaderButtons = ({
  isAuthenticated = false,
  showLogo = false,
}: Props) => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (link: string) => {
    navigate(link);
    setAnchorEl(null);
  };

  if (isAuthenticated) {
    return (
      <Box
        sx={{
          display: "flex",
          width: "100%",
          justifyContent: showLogo ? "space-between" : "flex-end",
          alignItems: "center",
          [theme.breakpoints.down("sm")]: {
            flexDirection: "column",
            marginTop: "2rem",
          },
        }}
      >
        {showLogo && (
          <Box
            sx={{
              marginLeft: "2rem",
              [theme.breakpoints.down("sm")]: {
                marginLeft: "0rem",
              },
            }}
          >
            <img
              src="/logo.png"
              alt="logo"
              style={{
                width: "10rem",
                height: "auto",
                cursor: "pointer",
              }}
            />
          </Box>
        )}

        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            paddingRight: "2rem",
            gap: "10px",
            width: "100%",
            marginBlock: "2rem",
            [theme.breakpoints.down("sm")]: {
              justifyContent: "center",
              paddingRight: "0",
            },
          }}
        >
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate("/candidate/alerts")}
            sx={{
              display: "flex",
              gap: "0.2rem",
              alignItems: "center",
            }}
          >
            Mis alertas
          </Button>
          <Button
            variant="contained"
            color="primary"
            // onClick={() => navigate("/auth/candidate/register")}
            sx={{
              display: "flex",
              columnGap: "0.2rem",
              alignItems: "center",
            }}
          >
            Mis postulaciones
          </Button>
          <Avatar
            src="https://fotosprofesionales.es/wp-content/uploads/2023/08/fotografo-de-retrato-madrid-foto-corporativa-hombre-12.jpg"
            alt="avatar"
            sx={{
              width: "3rem",
              height: "3rem",
              cursor: "pointer",
            }}
            onClick={handleClick}
          />
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
            sx={{
              "& .MuiMenu-paper": {
                marginTop: "1rem",
              },

              "& .MuiList-root": {
                paddingBottom: "0 !important",
                paddingTop: "0",
              },
            }}
          >
            <MenuItem
              disableTouchRipple
              sx={{
                backgroundColor: "primary.main",
                color: "white",
                fontWeight: "bold",
                "&:hover": {
                  backgroundColor: "primary.main",
                },
              }}
            >
              Luis de Tomas
            </MenuItem>
            <MenuItem onClick={() => handleClose("")}>Mi cuenta</MenuItem>
            <MenuItem onClick={() => handleClose("")}>Mi CV</MenuItem>
            <MenuItem onClick={() => handleClose("")}>Cerrar sesion</MenuItem>
          </Menu>
        </Box>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "flex-end",
        alignItems: "self-start",
        paddingRight: "2rem",
        gap: "10px",
        width: "100%",
        marginBlock: "2rem",
        [theme.breakpoints.down("sm")]: {
          justifyContent: "center",
          paddingRight: "0",
        },
      }}
    >
      <Button
        variant="contained"
        color="primary"
        sx={{
          display: "flex",
          gap: "0.2rem",
          alignItems: "center",
        }}
      >
        <PostAddOutlined
          sx={{
            fontSize: "2rem",
          }}
        />
        Publicar aviso
      </Button>
      <Button
        variant="contained"
        color="primary"
        onClick={() => navigate("/auth/candidate/register")}
        sx={{
          display: "flex",
          columnGap: "0.2rem",
          alignItems: "center",
        }}
      >
        <ManageSearchOutlined
          sx={{
            fontSize: "2rem",
          }}
        />
        Postula aquí
      </Button>
    </Box>
  );
};

export default HeaderButtons;
