import ContactForm from "@/components/contactForm";
import Footer from "@/components/layout/footer";
import { LocateIcon, MailIcon, PhoneCallIcon } from "lucide-react";
import { Suspense } from "react";
import React from "react";

export default function ContactPage() {
  return (
    <>
      <div className="max-w-screen-xl block mx-auto">
        <div className="px-2 md:px-6 md:py-16 py-12">
          <h2 className="capitalize text-center md:text-2xl text-lg text-zinc-900 font-bold md:mb-6 mb-4">
            thông tin liên hê
          </h2>
          <div className="flex md:flex-row flex-col flex-wrap justify-center items-start md:gap-8 gap-4">
            <div className="md:flex-1 w-full">
              <ContactForm />
            </div>
            <div className="md:flex-1 w-full flex flex-col justify-between h-full ">
              <ul className="grid gap-2 mb-3">
                <li className="flex items-center gap-3">
                  <PhoneCallIcon className="w-5 h-5 text-rose-500" />
                  011-231-232
                </li>
                <li className="flex items-center gap-3">
                  <MailIcon className="w-5 h-5 text-rose-500" />
                  email@gmail.com
                </li>
                <li className="flex items-center gap-3">
                  <LocateIcon className="w-5 h-5 text-rose-500" />
                  TP.HCM, Việt Nam
                </li>
              </ul>
              <Suspense>
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d1647.7625690645605!2d106.62947726207264!3d10.806567947854532!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752be27d8b4f4d%3A0x92dcba2950430867!2zVHLGsOG7nW5nIMSQ4bqhaSBo4buNYyBDw7RuZyBUaMawxqFuZyBUUC4gSOG7kyBDaMOtIE1pbmggKEhVSVQp!5e0!3m2!1svi!2s!4v1727770372505!5m2!1svi!2s"
                  style={{ border: 0 }}
                  height={290}
                  className="rounded-lg w-full"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </Suspense>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

{
}
