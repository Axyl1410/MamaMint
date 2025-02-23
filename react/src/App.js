import { Route, Routes } from "react-router-dom";
import Layout from "./components/layout/Layout";
import Home from "./pages/Home";
import Upload from "./pages/Upload";
import "./App.css";
import NFTDetail from "./pages/NFTDetail";
import Profile from "./pages/Profile";
import ProfileTest from "./pages/ProfileTest";
import Create from "./pages/Create";
import Explore from "./pages/Explore";
import CreateNFT from "./pages/CreateNFT";
import CollectionDetail from "./pages/CollectionDetail";
import CreateDropCollection from "./pages/CreateDropCollection";
import GenerativeArt from "./pages/GenerativeArtCollection";

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        {/*<Route path="/upload" element={<Upload />} />*/}
        <Route path="/generate" element={<GenerativeArt />} />
        {/*<Route path="/test" element={<CreateDropCollection />} />*/}
        <Route path="/explore" element={<Explore />} />
        <Route path="/collection/:collectionId" element={<CollectionDetail />} />
        <Route path="/profile/:address" element={<Profile />} />
        <Route path="/profile-test/:address" element={<ProfileTest />} />
        <Route path="/create" element={<Create />} />
        {/*<Route path="/create/nft" element={<CreateNFT />} />*/}
        <Route path="/nft/:contractAddress/:tokenId" element={<NFTDetail />} />
      </Route>
    </Routes>
  );
}

export default App;
