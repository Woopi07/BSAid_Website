import Button from './ui/Button.jsx';
import Coin from './ui/Coin.jsx';
import { ANDROID_DOWNLOAD_URL } from '../data/content.js';

export default function DownloadCTA() {
  return (
    <section id="download" className="py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gold px-6 py-14 text-center sm:px-12">
          <Coin className="absolute -left-6 -top-6 h-28 w-28 opacity-30" />
          <Coin className="absolute -bottom-8 right-6 h-24 w-24 opacity-30" />
          <h2 className="relative text-3xl font-bold sm:text-4xl">Your first case file is waiting.</h2>
          <p className="relative mx-auto mt-4 max-w-xl text-lg text-navy-900/80">
            BSAid is built for Android so you can study anywhere &mdash; between classes, on the commute, or the night
            before a quiz.
          </p>
          <div className="relative mt-8 flex justify-center">
            <Button href={ANDROID_DOWNLOAD_URL} icon="android" className="bg-navy text-white shadow-none hover:bg-navy-600">
              Download for Android
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
