import styled from "styled-components";
import CssBaseline from "@material-ui/core/CssBaseline";
import Layout, {
  Root,
  getHeader,
  getDrawerSidebar,
  getSidebarTrigger,
  getSidebarContent,
  getCollapseBtn,
  getContent,
  getInsetContainer,
  getInsetSidebar,
  getInsetFooter,
} from "@mui-treasury/layout";
import Color from "color";
import { makeStyles, Theme } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import CardActionArea from "@material-ui/core/CardActionArea";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import { useFourThreeCardMediaStyles } from "@mui-treasury/styles/cardMedia/fourThree";
import { memo, useEffect, useState } from "react";

const Header = getHeader(styled);
const CollapseBtn = getCollapseBtn(styled);
const Content = getContent(styled);
const InsetContainer = getInsetContainer(styled);
const InsetSidebar = getInsetSidebar(styled);
const InsetFooter = getInsetFooter(styled);

const scheme = Layout();

scheme.configureHeader((builder) => {
  builder
    .create("appHeader")
    .registerConfig("xs", {
      position: "sticky",
      initialHeight: 80,
    })
    .registerConfig("md", {
      position: "relative", // won't stick to top when scroll down
      initialHeight: 128,
    });
});

scheme.configureEdgeSidebar((builder) => {
  builder
    .create("primarySidebar", { anchor: "left" })
    .registerTemporaryConfig("xs", {
      width: "auto", // 'auto' is only valid for temporary variant
    });
});

scheme.configureInsetSidebar((builder) => {
  builder
    .create("secondarySidebar", { anchor: "right" })
    .registerFixedConfig("md", {
      width: 256,
    });
});

const useGridStyles = makeStyles(({ breakpoints }) => ({
  root: {
    [breakpoints.up("md")]: {
      justifyContent: "center",
    },
  },
}));

interface StylesProps {
  color: string;
}

const useStyles = makeStyles<Theme, StylesProps>(() => ({
  actionArea: {
    borderRadius: 16,
    transition: "0.2s",
    "&:hover": {
      transform: "scale(1.1)",
    },
  },
  card: ({ color }) => ({
    minWidth: 256,
    width: 256,
    borderRadius: 16,
    boxShadow: "none",
    "&:hover": {
      boxShadow: `0 6px 12px 0 ${Color(color)
        .rotate(-12)
        .darken(0.2)
        .fade(0.5)}`,
    },
  }),
  content: ({ color }) => {
    return {
      backgroundColor: color,
      padding: "1rem 1.5rem 1.5rem",
    };
  },
  title: {
    fontFamily: "Keania One",
    fontSize: "2rem",
    color: "#fff",
    textTransform: "uppercase",
  },
  subtitle: {
    fontFamily: "Montserrat",
    color: "#fff",
    opacity: 0.87,
    marginTop: "2rem",
    fontWeight: 500,
    fontSize: 14,
    overflow: "hidden",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
    wordWrap: "normal",
  },
}));

interface CustomCardProps {
  color: any;
  image: string;
  title: string;
  subtitle: string;
  url: string;
}

const CustomCard = ({
  color,
  image,
  title,
  subtitle,
  url,
}: CustomCardProps) => {
  const mediaStyles = useFourThreeCardMediaStyles();
  const classes = useStyles({ color });
  return (
    <CardActionArea
      className={classes.actionArea}
      onClick={() => window.open(url)}
    >
      <Card className={classes.card}>
        <CardMedia classes={mediaStyles} image={image} />
        <CardContent className={classes.content}>
          <Typography className={classes.title} variant={"h2"}>
            {title}
          </Typography>
          <Typography className={classes.subtitle} title={subtitle}>
            {subtitle}
          </Typography>
        </CardContent>
      </Card>
    </CardActionArea>
  );
};

export const SolidGameCardDemo = memo(function SolidGameCard() {
  const gridStyles = useGridStyles();
  const [data, setData] = useState<Site[]>();

  useEffect(() => {
    const run = async () => {
      try {
        const response = await fetch(process.env.REACT_APP_DATA_URL as string);
        const data: Site[] = await response.json();
        console.log(response, typeof response, data);
        setData(data);
      } catch (err) {
        console.error(err);
      }
    };

    run();
  }, []);

  return (
    <>
      <Grid classes={gridStyles} container spacing={4} wrap="wrap">
        {(data ?? []).map((site) => (
          <Grid key={site.title} item>
            <CustomCard {...site} />
          </Grid>
        ))}
      </Grid>
    </>
  );
});

const Blog = () => {
  return (
    <Root scheme={scheme}>
      {({ state: { sidebar } }) => (
        <>
          <CssBaseline />
          <Header>
            <img
              style={{
                objectFit: "cover",
                width: "100%",
                height: "100%",
              }}
              src="/head.jpg"
              alt=""
            ></img>
          </Header>
          <Content>
            <div
              style={{
                margin: "40px",
              }}
            >
              <SolidGameCardDemo />
            </div>
          </Content>
          <InsetFooter>{/* <FooterMockUp /> */}</InsetFooter>
        </>
      )}
    </Root>
  );
};

export default Blog;
