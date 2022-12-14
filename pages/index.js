import { useState, useEffect, useInterval } from "react";
import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import axios from "axios";

export default function Home() {
  const [data, setData] = useState([]);
  const [searchQuery, setSearchQuery] = useState(
    "QmcqvocMfm9LDSEDYmeexzeGt1QTY7T7AVitX9mG2qkvjR"
  );

  useEffect(() => {
    fetchData();
  }, [searchQuery]);

  const fetchData = () => {
    axios
      .post(
        "https://api.thegraph.com/index-node/graphql",
        {
          query: `query indexingStatuses($subgraphs: [String!]) {
              indexingStatuses(subgraphs: $subgraphs){
                subgraph
                synced
                health
                entityCount
                chains {
                  network
                  chainHeadBlock {
                    number
                  }
                  latestBlock {
                    number
                  }
                  earliestBlock {
                    number
                  }
                }
              }
            }`,
          variables: {
            ...(searchQuery && { subgraphs: [searchQuery] })
          }
        },
        {
          headers: {
            "Content-Type": "application/json"
          }
        }
      )
      .then(({ data }) => {
        setData(data.data.indexingStatuses);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>TheGraph Status</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          <a href="https://nextjs.org">TheGraph</a> Status
        </h1>

        <input
          className={styles.search}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && fetchData()}
          placeholder='Search subgraph by ID: "Qm..."'
          type="text"
          value={searchQuery}
        />

        <div className={styles.grid}>
          <a
            href={`https://api.thegraph.com/subgraphs/id/${data[0]?.subgraph}`}
            target="_blank"
            rel="noreferrer"
            className={styles.card}
          >
            <h2>ID</h2>
            <p>
              {data[0]?.subgraph ? data[0].subgraph.slice(0, 20) + "..." : "-"}
            </p>
          </a>

          <div className={styles.card}>
            <h2>Network</h2>
            <p>{data[0]?.chains[0]?.network || "-"}</p>
          </div>

          <div className={styles.card}>
            <h2>Health</h2>
            <p>{data[0]?.health === "healthy" ? "???" : "???"}</p>
          </div>

          <div className={styles.card}>
            <h2>Synced</h2>
            <p>{data[0]?.synced ? "???" : "???"}</p>
          </div>

          <div className={styles.card}>
            <h2>Entities</h2>
            <p>{data[0]?.entityCount || "-"}</p>
          </div>

          <div className={styles.card}>
            <h2>#Start</h2>
            <p>{data[0]?.chains[0]?.earliestBlock?.number || "-"}</p>
          </div>

          <div className={styles.card}>
            <h2>#Synced</h2>
            <p>{data[0]?.chains[0]?.latestBlock?.number || "-"}</p>
          </div>

          <div className={styles.card}>
            <h2>#Latest</h2>
            <p>{data[0]?.chains[0]?.chainHeadBlock?.number || "-"}</p>
          </div>
          <div className={styles.card}>
            <h2>%Progress</h2>
            <p>
              {(
                (data[0]?.chains[0]?.latestBlock?.number /
                  data[0]?.chains[0]?.chainHeadBlock?.number) *
                100
              ).toFixed(2) || "-"}
            </p>
          </div>
        </div>
      </main>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{" "}
          <span className={styles.logo}>
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </span>
        </a>
      </footer>
    </div>
  );
}
