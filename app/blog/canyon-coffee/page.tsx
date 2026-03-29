import Link from "next/link";
import Image from "next/image";

const DATE_ISO = "2026-03-22";

export default function CanyonCoffeePage() {
  return (
    <div className="min-h-screen background py-12 px-4 sm:px-8">
      <article className="max-w-xl mx-auto w-full">
        <Link
          href="/blog"
          className="text-xs uppercase tracking-wide underline underline-offset-4 hover:text-white transition-colors inline-block mb-8"
        >
          ← blog
        </Link>

        <time
          dateTime={DATE_ISO}
          className="text-xs text-gray-400 block mb-3"
        >
          March 22, 2026
        </time>

        <h1 className="text-2xl font-fe font-bold mb-8">Canyon Coffee</h1>

        <div className="flex flex-col gap-6 text-md leading-relaxed">
          <p>
            I went to a trendy coffee place for the very first time in a long
            time. At first, I struggled to put my finger on what felt so
            different from Canyon Coffee, an equally trendy place in terms of
            the East Los Angeles crew.
          </p>
          <figure className="space-y-2 my-2">
            <div className="relative w-full aspect-[4/3] rounded-xl border-2 overflow-hidden">
                <Image
                src="/images/blog/bird-on-windowsill.png"
                alt="Short description for screen readers"
                fill
                className="object-cover"
                sizes="(max-width: 576px) 100vw, 576px"
                />
            </div>
            <figcaption className="text-xs text-gray-400">
                Optional caption
            </figcaption>
            </figure>
          

          <p>
    
          </p>

          <p>
            Amongst my East Los Angeles friends, Canyon Coffee, as we’ve talked
            about it, operates quite like Foucault’s panopticon: to arrive
            there, you must want to look, and must also understand that you will
            be looked at. It is the tacit agreement you enter into if you
            suggest to your friend that you want to meet there. Canyon Coffee is so much a hallmark of the now Los
            Feliz/Silverlake/Echo Park “east los angeles” crew that it made its
            appearance multiple times in the eponymous I Love LA show by Rachel
            Sennott—cementing its place in the know.
            </p>
            <p>
            The dance that James Baldwin mentions in Giovanni’s Room: everyone
            as part of a play, the illusion only put under fire when some
            micro-celebrity shows up and almost imperceptibly, a wind blows
            across every act in the room, slight tugs on the sleeves, slight
            juts of the head to take a look but be inconspicuous.
          </p>

          <p>
            So, if not the coffee, what is the transaction? What are we buying here? What would draw someone here on a
            sunny day in Los Angeles, on our weekends? The drinks at this place
            are not the promise, are not the draw—the space itself is. Everyone
            is beautiful, no one is smiling or loud, and no one is talking to
            each other between groups. You consent to becoming another one of
            the decorations.
          </p>

          <p>
            By arriving here at Canyon Coffee, you subject yourself to East LA’s,
            Williamsburg’s, the coastal elite’s creative class’s test and assert
            that you can fit into the fabric of Los Angeles’s East Los Angeles:
            ever cool, absolutely effortless, ever candidly-photographed. The
            claustrophobic weight of fabricated nonchalance occupies the
            sun-warmed air that streams in from both of its open corner doors.
            Canyon Coffee quite literally could only exist in the ever warm air
            of Los Angeles.
          </p>

          <p>
            Unlike Stagger, not a single person in this store, who is part of
            this shared performance to blend into the effortless and cool Los
            Angeles background, would dare to pull out their phone to take
            B-roll shots of their on tap pistachio latte. None of them would also
            dare to make a video and share it on the internet telling you to come
            to canyon. There is no transaction here, frictionlessness here. This
            place does not promise you anything other than a pretty good coffee,
            unless you too are able to see and desire and want its performance
            as well. Everyone at this store understands for this store to stay
            the way it is, you cannot invite the public eye, the trendy eye, and
            pollute this very ambience you came here to be part and parcel of.
            Stagger Coffee could be anywhere in the world, its white walls and
            light birch not reminding you that you are in Los Angeles.
          </p>

          <p>
            Under the blanket and disguise of a minimalist coffee store, ten
            baristas behind the counter have five cups ready for you, ensuring
            that the assembly line of production can make its way through the
            thirty minute queues as quickly as possible. Much like how Figma and
            modern aesthetics with websites promise a clean, rich, better than
            the other aesthetic, and behind the screen we find the laborers not
            making quite enough money.
          </p>

          <p>
            Here, in a place surrounded by minimalist walls and shelves with
            matcha whisks collecting dust, no one can pretend that they are
            better than anyone else, because to be here, you must have also used
            the algorithm to get here. And even if it wasn't algorithm assisted, 
            there is no way to indicate to the other people who come that you 
            somehow found this place in a different way. The internet, and the
            doomscrolling and the addiction is the great equalizer. Here at
            stagger coffee, everyone is beautiful, everyone has long hair,
            everyone is wearing something that is basic, flattened by the
            internet, one way or another. How else do we pay our dues for places
            like this to exist? How else do we consume and not talk to anyone
            else around us?
          </p>

          <p>
            Everyone here is wearing black and white; not a single non-Apple
            ecosystem product exists at the long birch tables, save for maybe
            the Sony headphones that have made its way into the cultural
            conversation of sleek technology; med students are studying with
            their flash cards together, hair pulled back into a slick back bun.
            The final accessory, then, for you to complete your beautiful
            Saturday morning of visual productivity is a bright green, gorgeous
            caffeinated drink. At Stagger, the drinks are the promise. You do not
            have to be or look like anything to consume what it has to offer to
            you. The bright, creamy matcha drinks attract your eye as you search
            in Los Angeles. Here you can be invisible. The bright green, creamy
            matcha drinks are shown to you in images as you search on instagram
            for the best matcha in los angeles. As I sat at the long birch, light
            wood table, I began to notice, and realize, that I recognized many of
            the items around me. It was looking at a realization of my instagram
            feed and the ads that I get fed: ratboi gingham skirts, Puma ballet
            flats, Miu miu tortoiseshell glasses, an all black owala water
            bottle, wildflower cases, a glaze of rhode’s lip balm while waiting
            in line, owala water bottles, tiny oval glasses, small shirts and
            baggy light jeans.
          </p>

          <p>
            To be here, on a sunday morning, to have chosen the quick delight of
            a delicious bright green drink on the sunny day in Los Angeles, on
            one of the only days we are outside of the 9 to 5, to at least spend
            thirty minutes in a queue, to endure, you must desire the drink so
            much. And that kind of desire is only cultivated and built from
            online and public knowledge of this place promising you that this
            nine dollar green drink will bring you the joy that hanging out with
            friends might have when you were younger.
          </p>
        </div>
      </article>
    </div>
  );
}
