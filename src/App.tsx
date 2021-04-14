import styled from "styled-components";
import CssBaseline from "@material-ui/core/CssBaseline";
import Layout, {
  Root,
  getHeader,
  getContent,
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
import { ChangeEvent, memo, useEffect, useMemo, useState } from "react";
import Fuse from "fuse.js";
import InputBase from "@material-ui/core/InputBase";
import Search from "@material-ui/icons/Search";
import { useSearchInputStyles } from "@mui-treasury/styles/input/search";

const fuseOptions = {
  includeScore: true,
  // equivalent to `keys: [['author', 'tags', 'value']]`
  keys: ["title", "subtitle"],
};

const Header = getHeader(styled);
const Content = getContent(styled);
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

type SiteFuse = Fuse<Site>;

interface GroupedItem {
  cat: string;
  items: Site[];
}

type GroupedList = GroupedItem[];

interface GroupedProps {
  list: GroupedList;
}
const GroupedCardList = memo(function Grouped({ list }: GroupedProps) {
  const gridStyles = useGridStyles();
  return (
    <div>
      {list.map((cat) => (
        <div key={cat.cat}>
          <h3 style={{ margin: "40px 0" }}>{cat.cat ?? "未分类"}</h3>
          <Grid classes={gridStyles} container spacing={4} wrap="wrap">
            {cat.items.map((item) => (
              <Grid key={item.title} item>
                <CustomCard {...item} />
              </Grid>
            ))}
          </Grid>
        </div>
      ))}
    </div>
  );
});

function group(data: Site[]): GroupedList {
  const list: GroupedList = [];
  data.forEach((item) => {
    const cat = getCat(item.category);
    cat.items.push(item);
  });
  return list;

  function getCat(cat: string): GroupedItem {
    const found = list.find((item) => item.cat === cat);
    if (found) {
      return found;
    }

    const newCat = {
      cat,
      items: [],
    } as GroupedItem;

    list.push(newCat);
    return newCat;
  }
}

const SolidGameCardList = memo(function CardList() {
  const [rawData, setRawData] = useState<Site[]>([]);
  const [fuse, setFuse] = useState<SiteFuse>();
  const [kw, setKw] = useState<string>("");
  const styles = useSearchInputStyles();
  // const [data, setData] = useState<Site[]>();

  useEffect(() => {
    const run = async () => {
      try {
        const response = await fetch(process.env.REACT_APP_DATA_URL as string);
        const data: Site[] = await response.json();
        setFuse(new Fuse(data, fuseOptions));
        setRawData(data);
      } catch (err) {
        console.error(err);
      }
    };

    run();
  }, []);

  const searchResults: Fuse.FuseResult<Site>[] = useMemo(() => {
    return kw && fuse ? fuse.search(kw) : [];
  }, [fuse, kw]);

  const grouped = group(
    kw && fuse ? searchResults.map(({ item }) => item) : rawData
  );

  const onSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    setKw(event.target.value);
  };
  return (
    <div>
      <div style={{ textAlign: "right" }}>
        <InputBase
          classes={styles}
          placeholder={"搜索..."}
          startAdornment={<Search />}
          onChange={onSearchChange}
        />
      </div>
      <GroupedCardList list={grouped} />
    </div>
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
              <SolidGameCardList />
            </div>
          </Content>
          <InsetFooter>{/* <FooterMockUp /> */}</InsetFooter>
        </>
      )}
    </Root>
  );
};

export default Blog;
