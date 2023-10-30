"use client";

import React, { FC, useRef } from "react";
import Label from "@/components/form/Label";
import RatingStarInput from "@/components/form/RatingStarInput";
import Input from "@/components/form/Input";
import TextArea from "@/components/form/TextArea";
import Select from "@/components/form/Select";
import { Form, Formik } from "formik";

import * as Yup from "yup";
import Dots from "@/components/Dots";

const productConsumers = [
  { value: "0", label: "A friend" },
  { value: "1", label: "Child" },
  { value: "2", label: "Grandchild" },
  { value: "3", label: "Grandparent" },
  { value: "4", label: "My family" },
  { value: "5", label: "Myself" },
  { value: "6", label: "Other" },
  { value: "7", label: "Parent" },
  { value: "8", label: "Partner" },
  { value: "9", label: "Sibling" },
  { value: "10", label: "Spouse" },
];

const occasions = [
  { value: "0", label: "Anniversary" },
  { value: "1", label: "Birthday" },
  { value: "2", label: "Christmas/Hanukkah" },
  { value: "3", label: "Everyday use/just because" },
  { value: "4", label: "Father's Day" },
  { value: "5", label: "Graduation" },
  { value: "6", label: "Holiday (not listed)" },
  { value: "7", label: "Housewarming" },
  { value: "8", label: "Mother's Day" },
  { value: "9", label: "Other" },
  { value: "10", label: "Sympathy" },
  { value: "11", label: "Thank you" },
  { value: "12", label: "Valentine's Day" },
  { value: "13", label: "Wedding" },
];

const ReviewForm = () => {
  const imageRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLInputElement>(null);

  return (
    <Formik
      initialValues={{
        id: "",
        name: "",
        rating: 0,
        headline: "",
        review: "",
        recommend: "",
        consumer: "",
        occasion: "",
        image: "",
        video: "",
        nickname: "",
        location: "",
        email: "",
        terms: false,
      }}
      validationSchema={Yup.object({
        id: Yup.string().min(5).required(),
        name: Yup.string().min(5).required(),
        rating: Yup.number().min(1).max(5).required(),
        headline: Yup.string().min(5).required(),
        review: Yup.string().min(5).required(),
        recommend: Yup.string(),
        consumer: Yup.string().required(),
        occasion: Yup.string().required(),
        image: Yup.mixed()
          .nullable()
          .test("is-file-too-big", "Image exceeds 2MB", () => {
            let valid = true;
            const files = imageRef?.current?.files;
            if (files) {
              const fileArr = Array.from(files);
              fileArr.forEach((file) => {
                const size = file.size / 1024 / 1024;
                if (size > 2) {
                  valid = false;
                }
              });
            }
            return valid;
          })
          .test(
            "is-file-of-correct-type",
            "Image is not of supported type",
            () => {
              let valid = true;
              const files = imageRef?.current?.files;
              if (files) {
                const fileArr = Array.from(files);
                fileArr.forEach((file) => {
                  const type = file.type.split("/")[1];
                  const validTypes = ["png", "webp", "jpg", "jpeg"];
                  if (!validTypes.includes(type)) {
                    valid = false;
                  }
                });
              }
              return valid;
            }
          ),
        video: Yup.mixed()
          .nullable()
          .test("is-file-too-big", "Video exceeds 10MB", () => {
            let valid = true;
            const files = videoRef?.current?.files;
            if (files) {
              const fileArr = Array.from(files);
              fileArr.forEach((file) => {
                const size = file.size / 1024 / 1024;
                if (size > 10) {
                  valid = false;
                }
              });
            }
            return valid;
          })
          .test(
            "is-file-of-correct-type",
            "Video is not of supported type",
            () => {
              let valid = true;
              const files = videoRef?.current?.files;
              if (files) {
                const fileArr = Array.from(files);
                fileArr.forEach((file) => {
                  const type = file.type.split("/")[1];

                  const validTypes = ["mp4"];
                  if (!validTypes.includes(type)) {
                    valid = false;
                  }
                });
              }
              return valid;
            }
          ),
        nickname: Yup.string().min(3).required(),
        location: Yup.string().min(5).required(),
        email: Yup.string().email().required(),
        terms: Yup.bool().oneOf(
          [true],
          "You need to accept the terms and conditions"
        ),
      })}
      onSubmit={(values, { setSubmitting }) => {
        setSubmitting(true);
        const formdata = new FormData();
        formdata.append("productId", values.id);
        formdata.append("author", values.nickname);
        formdata.append("email", values.email);
        formdata.append("location", values.location);
        formdata.append("reviewRating", values.rating.toString());
        formdata.append("reviewTitle", values.headline);
        formdata.append("reviewMessage", values.review);
        formdata.append("reviewRecommendProduct", values.recommend);
        formdata.append("productName", values.name);
        formdata.append("productSKU", "Product's Sku");
        formdata.append("productImageUrl", "");
        formdata.append("productUrl", "");
        formdata.append("reviewSource", "api");
        // formdata.append("photo0", values.image);
        // formdata.append("video0", values.video);

        fetch("/api/review", {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: formdata,
        })
          .then((response) => response.json())
          .then((res) => {
            console.log(res);
          })
          .catch((e) => console.log(e))
          .finally(() => setSubmitting(false));
      }}
    >
      {({
        handleBlur,
        handleChange,
        setFieldValue,
        setFieldTouched,
        errors,
        touched,
        values,
        isSubmitting,
      }) => {
        const touchedErrors = Object.keys(errors).filter(
          (key) => touched[key as keyof typeof touched]
        );

        return (
          <Form className="font-helvetica w-2/5">
            {touchedErrors.length > 0 && (
              <div
                id="errors"
                className="bg-[#f2dede] text-[#a94442] mb-5 p-[15px] mt-[50px] rounded pt-10"
              >
                <p className="mb-2.5 text-[15px] font-bold">
                  There are {touchedErrors.length} errors in this form
                </p>
                <ul className="ml-5 list-disc list-outside pb-2.5">
                  {touchedErrors.map((key, index) => (
                    <li key={key + index}>
                      {errors[key as keyof typeof errors]}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <p className="text-sm my-3 text-brand-secondary-1">
              <abbr className="text-[#d00]" title="required">
                *
              </abbr>
              Required question
            </p>
            <div className="fields flex flex-col gap-[30px]">
              <Input
                label="Product ID"
                name="id"
                placeholder="Enter product Id"
                onChange={handleChange}
                onBlur={handleBlur}
                hasError={!!touched.id && !!errors.id}
              />

              <Input
                label="Product Name"
                name="name"
                placeholder="Enter product name"
                onChange={handleChange}
                onBlur={handleBlur}
                hasError={!!touched.name && !!errors.name}
              />

              <div>
                <Label as="p" hasError={!!errors.rating && !!touched.rating}>
                  Overall Rating
                </Label>
                <RatingStarInput
                  onChange={(value) => {
                    setFieldValue("rating", value, true);
                    setFieldTouched("rating", true, false);
                  }}
                  value={values.rating}
                />
              </div>

              <Input
                label="Review Headline"
                name="headline"
                placeholder="Ex. I would buy this product again and again"
                onChange={handleChange}
                onBlur={handleBlur}
                hasError={!!touched.headline && !!errors.headline}
              />

              <TextArea
                label="Tell us what you think. We'd love to know..."
                name="review"
                placeholder="Is the item what you expected? How's its quality? Do you (or your giftee) like it (or love it!)? Anything else you want to share?"
                rows={5}
                onChange={handleChange}
                onBlur={handleBlur}
                hasError={!!touched.review && !!errors.review}
              />

              <div>
                <p>Bottom Line</p>
                <Label required={false}>Select One</Label>

                <div className="mt-2.5">
                  <div className="relative overflow-hidden border border-[#949494] hover:bg-[#e6e6e6]  cursor-pointer">
                    <input
                      type="radio"
                      name="recommend"
                      id="YesRecomend"
                      value="Yes"
                      className="peer  w-full h-full absolute appearance-none"
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    <label
                      htmlFor="YesRecomend"
                      className="w-full p-2.5  cursor-pointer text-sm block peer-checked:text-white peer-checked:bg-black "
                    >
                      Yes, I would recommend this to a friend
                    </label>
                  </div>
                  <div className="relative overflow-hidden border border-[#949494] hover:bg-[#e6e6e6] border-t-0  cursor-pointer">
                    <input
                      type="radio"
                      name="recommend"
                      id="DontRecomend"
                      value="No"
                      className=" peer w-full h-full absolute appearance-none"
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    <label
                      htmlFor="DontRecomend"
                      className="w-full p-2.5  cursor-pointer text-sm block peer-checked:text-white peer-checked:bg-black "
                    >
                      No, I would not recommend this to a friend
                    </label>
                  </div>
                </div>
              </div>

              <Select
                label="Who did you purchase this for?"
                options={productConsumers}
                defaultText="Select One"
                name="consumer"
                onChange={handleChange}
                onBlur={handleBlur}
                hasError={!!touched.consumer && !!errors.consumer}
              />

              <Select
                label="What occasion did you purchase this for?"
                options={occasions}
                defaultText="Select One"
                name="occasion"
                onChange={handleChange}
                onBlur={handleBlur}
                hasError={!!touched.occasion && !!errors.occasion}
              />

              {/* <div className=" flex items-center gap-2.5">
                <p className="min-w-[120px]  capitalize text-sm text-[#303533] mb-[5px]">
                  Add an Image
                </p>
                <div className="relative overflow-hidden group/image">
                  <input
                    ref={imageRef}
                    type="file"
                    name="image"
                    id="review-image"
                    className=" absolute inset-0 opacity-0"
                    accept="image/*"
                    onChange={(e) => {
                      if (!e.currentTarget.files) return;
                      setFieldValue("image", e.currentTarget.files[0], true);
                    }}
                    onBlur={handleBlur}
                  />
                  <label
                    htmlFor="review-image"
                    className="flex gap-[5px] items-center w-max cursor-pointer bg-[#f6f6f6] text-[#0076ba] rounded-sm text-sm   border border-b-2 border-[#ccc] px-3 py-1.5 group-hover/image:bg-[#ddd]  group-hover/image:text-[#005687] group-hover/image:border-[#adadad]"
                  >
                    <svg
                      className="h-6 w-auto"
                      version="1.1"
                      viewBox="0 0 432 432"
                      xmlSpace="preserve"
                      focusable="false"
                      aria-hidden="true"
                    >
                      <g>
                        <circle fill="#EAEAE9" cx="216" cy="216" r="216" />
                        <polygon
                          fill="#FFFFFF"
                          points="87.8,256.6 169.8,256.6 169.8,274 256.8,274 256.8,254.2 336.4,254.2 336.4,326.2 92.8,326.2"
                        />
                        <g>
                          <path
                            fill="#767676"
                            d="M350.2,243.4H249.6v22.4h-67.2v-22.4H81.8v89.4h268.4V243.4z M334,316.6H98v-57.2h68.4v22.4h99.4v-22.4    H334V316.6z"
                          />
                          <polygon
                            fill="#767676"
                            points="227.2,232.2 227.2,129 269.2,171 285,155.2 216.6,86.8 148.2,155.2 164,171 204.8,130.2     204.8,232.2"
                          />
                        </g>
                      </g>
                    </svg>
                    Upload
                  </label>
                </div>

                <button
                  type="button"
                  className="flex gap-[5px] items-center w-max cursor-pointer bg-[#f6f6f6] text-[#0076ba] rounded-sm text-sm   border border-b-2 border-[#ccc] px-3 py-1.5 hover:bg-[#ddd]  hover:text-[#005687] hover:border-[#adadad]"
                >
                  <svg
                    className="h-6 w-auto"
                    xmlns="http://www.w3.org/2000/svg"
                    xmlnsXlink="http://www.w3.org/1999/xlink"
                    viewBox="0 0 432 432"
                    focusable="false"
                    aria-hidden="true"
                  >
                    <circle fill="#EAEAE8" cx="215" cy="216" r="216" />
                    <defs>
                      <path
                        id="pr-fba"
                        d="M215.2 109.9c-26.9 0-30.3.1-40.9.6-10.5.5-17.7 2.2-24 4.6-6.5 2.6-12.1 5.9-17.6 11.5-5.5 5.6-8.9 11-11.5 17.6-2.5 6.3-4.1 13.5-4.6 24.1-.5 10.5-.6 13.9-.6 40.8s.1 30.3.6 40.9c.5 10.5 2.2 17.7 4.6 24.1 2.6 6.5 5.9 12.1 11.5 17.6 5.5 5.5 11.1 8.9 17.6 11.5 6.3 2.5 13.5 4.1 24.1 4.6 10.6.5 13.9.6 40.9.6 26.9 0 30.3-.1 40.9-.6 10.5-.5 17.7-2.2 24.1-4.6 6.5-2.6 12.1-5.9 17.6-11.5 5.5-5.5 8.9-11.1 11.5-17.6 2.5-6.3 4.1-13.5 4.6-24.1.5-10.6.6-13.9.6-40.9 0-26.9-.1-30.3-.6-40.9-.5-10.5-2.2-17.7-4.6-24.1-2.6-6.5-5.9-12.1-11.5-17.6-5.6-5.5-11.1-8.8-17.7-11.4-6.3-2.5-13.5-4.1-24.1-4.6-10.6-.5-13.9-.6-40.9-.6"
                      />
                    </defs>
                    <clipPath id="pr-fbb">
                      <use xlinkHref="#pr-fba" overflow="visible" />
                    </clipPath>
                    <path
                      clipPath="url(#pr-fbb)"
                      fill="#FFF"
                      d="M80.1 73.9h270.3v270.3H80.1z"
                    />
                    <g>
                      <defs>
                        <path
                          id="pr-fbc"
                          d="M215 120.4c28.9 0 32.3.1 43.7.6 10.6.5 16.3 2.3 20.1 3.7 5.1 1.9 8.6 4.3 12.4 8.1 3.8 3.8 6.2 7.3 8.1 12.4 1.5 3.8 3.2 9.5 3.7 20.1.5 11.4.6 14.8.6 43.7 0 28.9-.1 32.3-.6 43.7-.5 10.6-2.3 16.3-3.7 20.1-1.9 5.1-4.3 8.6-8.1 12.4-3.8 3.8-7.3 6.2-12.4 8.1-3.8 1.5-9.5 3.2-20.1 3.7-11.4.5-14.8.6-43.7.6s-32.3-.1-43.7-.6c-10.6-.5-16.3-2.3-20.1-3.7-5.1-1.9-8.6-4.3-12.4-8.1-3.8-3.8-6.2-7.3-8.1-12.4-1.5-3.8-3.2-9.5-3.7-20.1-.5-11.4-.6-14.8-.6-43.7 0-28.9.1-32.3.6-43.7.5-10.6 2.3-16.3 3.7-20.1 1.9-5.1 4.3-8.6 8.1-12.4 3.8-3.8 7.3-6.2 12.4-8.1 3.8-1.5 9.5-3.2 20.1-3.7 11.4-.5 14.8-.6 43.7-.6m0-19.5c-29.4 0-33 .1-44.6.7-11.5.5-19.3 2.4-26.2 5-7.1 2.8-13.2 6.4-19.2 12.5s-9.7 12-12.5 19.2c-2.7 6.8-4.5 14.7-5 26.3-.6 11.5-.7 15.1-.7 44.5s.1 33 .7 44.6c.5 11.5 2.4 19.3 5 26.3 2.8 7.1 6.4 13.2 12.5 19.2 6 6 12.1 9.7 19.2 12.5 6.8 2.7 14.7 4.5 26.3 5 11.6.5 15.2.7 44.6.7 29.4 0 33-.1 44.6-.7 11.5-.5 19.3-2.4 26.3-5 7.1-2.8 13.2-6.4 19.2-12.5 6-6 9.7-12.1 12.5-19.2 2.7-6.8 4.5-14.7 5-26.3.5-11.6.7-15.2.7-44.6 0-29.4-.1-33-.7-44.6-.5-11.5-2.4-19.3-5-26.3-2.8-7.1-6.4-13.2-12.5-19.2s-12.2-9.6-19.3-12.4c-6.8-2.7-14.7-4.5-26.3-5-11.6-.6-15.3-.7-44.6-.7"
                        />
                      </defs>
                      <clipPath id="pr-fbd">
                        <use xlinkHref="#pr-fbc" overflow="visible" />
                      </clipPath>
                      <path
                        clipPath="url(#pr-fbd)"
                        fill="#767677"
                        d="M70.9 64.9h288.3v288.3H70.9z"
                      />
                    </g>
                    <g>
                      <defs>
                        <path
                          id="pr-fbe"
                          d="M225.8 186v-11.3c0-5.4 3.7-6.7 6.3-6.7h15.8v-24.2H226c-24.2 0-29.7 18-29.7 29.6V186h-14.1v28.2h14.2v70.6h28.3v-70.6h20.9l.9-11.1 1.7-17.1h-22.4z"
                        />
                      </defs>
                      <clipPath id="pr-fbf">
                        <use xlinkHref="#pr-fbe" overflow="visible" />
                      </clipPath>
                      <path
                        clipPath="url(#pr-fbf)"
                        fill="#767677"
                        d="M146.3 107.7h138v213.1h-138z"
                      />
                    </g>
                  </svg>
                  Facebook
                </button>
                <button
                  type="button"
                  className="flex gap-[5px] items-center w-max cursor-pointer bg-[#f6f6f6] text-[#0076ba] rounded-sm text-sm   border border-b-2 border-[#ccc] px-3 py-1.5 hover:bg-[#ddd]  hover:text-[#005687] hover:border-[#adadad]"
                >
                  <svg
                    className="h-6 w-auto"
                    version="1.1"
                    viewBox="0 0 432 432"
                    xmlSpace="preserve"
                    focusable="false"
                    aria-hidden="true"
                  >
                    <circle fill="#EAEAE8" cx="216" cy="216" r="216" />
                    <path
                      fill="#FFFFFF"
                      d="M214.1,115c-26.9,0-30.3,0.1-40.9,0.6c-10.5,0.5-17.7,2.2-24,4.6c-6.5,2.6-12.1,5.9-17.6,11.5  c-5.5,5.6-8.9,11-11.5,17.6c-2.5,6.3-4.1,13.5-4.6,24.1c-0.5,10.5-0.6,13.9-0.6,40.8s0.1,30.3,0.6,40.9c0.5,10.5,2.2,17.7,4.6,24.1  c2.6,6.5,5.9,12.1,11.5,17.6c5.5,5.5,11.1,8.9,17.6,11.5c6.3,2.5,13.5,4.1,24.1,4.6s13.9,0.6,40.9,0.6s30.3-0.1,40.9-0.6  c10.5-0.5,17.7-2.2,24.1-4.6c6.5-2.6,12.1-5.9,17.6-11.5c5.5-5.5,8.9-11.1,11.5-17.6c2.5-6.3,4.1-13.5,4.6-24.1s0.6-13.9,0.6-40.9  s-0.1-30.3-0.6-40.9c-0.5-10.5-2.2-17.7-4.6-24.1c-2.6-6.5-5.9-12.1-11.5-17.6s-11.1-8.8-17.7-11.4c-6.3-2.5-13.5-4.1-24.1-4.6  C244.4,115,241,115,214.1,115z"
                    />
                    <path
                      fill="#767677"
                      d="M214.1,125.5c28.9,0,32.3,0.1,43.7,0.6c10.6,0.5,16.3,2.3,20.1,3.7c5.1,1.9,8.6,4.3,12.4,8.1  s6.2,7.3,8.1,12.4c1.5,3.8,3.2,9.5,3.7,20.1c0.5,11.4,0.6,14.8,0.6,43.7s-0.1,32.3-0.6,43.7c-0.5,10.6-2.3,16.3-3.7,20.1  c-1.9,5.1-4.3,8.6-8.1,12.4s-7.3,6.2-12.4,8.1c-3.8,1.5-9.5,3.2-20.1,3.7c-11.4,0.5-14.8,0.6-43.7,0.6s-32.3-0.1-43.7-0.6  c-10.6-0.5-16.3-2.3-20.1-3.7c-5.1-1.9-8.6-4.3-12.4-8.1c-3.8-3.8-6.2-7.3-8.1-12.4c-1.5-3.8-3.2-9.5-3.7-20.1  c-0.5-11.4-0.6-14.8-0.6-43.7s0.1-32.3,0.6-43.7c0.5-10.6,2.3-16.3,3.7-20.1c1.9-5.1,4.3-8.6,8.1-12.4c3.8-3.8,7.3-6.2,12.4-8.1  c3.8-1.5,9.5-3.2,20.1-3.7C181.8,125.5,185.2,125.5,214.1,125.5 M214.1,106c-29.4,0-33,0.1-44.6,0.7c-11.5,0.5-19.3,2.4-26.2,5  c-7.1,2.8-13.2,6.4-19.2,12.5c-6,6.1-9.7,12-12.5,19.2c-2.7,6.8-4.5,14.7-5,26.3c-0.6,11.5-0.7,15.1-0.7,44.5s0.1,33,0.7,44.6  c0.5,11.5,2.4,19.3,5,26.3c2.8,7.1,6.4,13.2,12.5,19.2c6,6,12.1,9.7,19.2,12.5c6.8,2.7,14.7,4.5,26.3,5s15.2,0.7,44.6,0.7  s33-0.1,44.6-0.7c11.5-0.5,19.3-2.4,26.3-5c7.1-2.8,13.2-6.4,19.2-12.5c6-6,9.7-12.1,12.5-19.2c2.7-6.8,4.5-14.7,5-26.3  c0.5-11.6,0.7-15.2,0.7-44.6s-0.1-33-0.7-44.6c-0.5-11.5-2.4-19.3-5-26.3c-2.8-7.1-6.4-13.2-12.5-19.2s-12.2-9.6-19.3-12.4  c-6.8-2.7-14.7-4.5-26.3-5C247.1,106,243.5,106,214.1,106z M214.1,158.6c-30.7,0-55.5,24.8-55.5,55.5s24.8,55.5,55.5,55.5  s55.5-24.8,55.5-55.5S244.7,158.6,214.1,158.6z M214.1,250.1c-19.9,0-36.1-16.1-36.1-36.1s16.1-36.1,36.1-36.1s36.1,16.1,36.1,36.1  S234,250.1,214.1,250.1z M284.8,156.4c0,7.2-5.8,13-13,13s-12.9-5.8-12.9-13s5.8-13,13-13C279,143.4,284.8,149.2,284.8,156.4z"
                    />
                  </svg>
                  Instagram
                </button>
              </div>

              <div className=" flex items-center gap-2.5">
                <p className="min-w-[120px] capitalize text-sm text-[#303533] mb-[5px]">
                  Add A Video
                </p>
                <div className="relative overflow-hidden group/video">
                  <input
                    ref={videoRef}
                    type="file"
                    name="video"
                    id="review-video"
                    className=" absolute inset-0 opacity-0"
                    accept="video/*"
                    onChange={(e) => {
                      if (!e.currentTarget.files) return;
                      setFieldValue("video", e.currentTarget.files[0]);
                    }}
                    onBlur={handleBlur}
                  />
                  <label
                    htmlFor="review-video"
                    className="flex gap-[5px] items-center w-max cursor-pointer bg-[#f6f6f6] text-[#0076ba] rounded-sm text-sm   border border-b-2 border-[#ccc] px-3 py-1.5 group-hover/video:bg-[#ddd]  group-hover/video:text-[#005687] group-hover/video:border-[#adadad]"
                  >
                    <svg
                      className="h-6 w-auto"
                      version="1.1"
                      viewBox="0 0 432 432"
                      xmlSpace="preserve"
                      focusable="false"
                      aria-hidden="true"
                    >
                      <g>
                        <circle fill="#EAEAE9" cx="216" cy="216" r="216" />
                        <polygon
                          fill="#FFFFFF"
                          points="87.8,256.6 169.8,256.6 169.8,274 256.8,274 256.8,254.2 336.4,254.2 336.4,326.2 92.8,326.2"
                        />
                        <g>
                          <path
                            fill="#767676"
                            d="M350.2,243.4H249.6v22.4h-67.2v-22.4H81.8v89.4h268.4V243.4z M334,316.6H98v-57.2h68.4v22.4h99.4v-22.4    H334V316.6z"
                          />
                          <polygon
                            fill="#767676"
                            points="227.2,232.2 227.2,129 269.2,171 285,155.2 216.6,86.8 148.2,155.2 164,171 204.8,130.2     204.8,232.2"
                          />
                        </g>
                      </g>
                    </svg>
                    Upload
                  </label>
                </div>
              </div> */}

              <Input
                label="Nickname"
                name="nickname"
                placeholder="Ex. Dave the biker (Please don't use your full first and last name or we can't publish your review)"
                onChange={handleChange}
                onBlur={handleBlur}
                hasError={!!touched.nickname && !!errors.nickname}
              />
              <Input
                label="Location"
                name="location"
                placeholder="Ex. Brooklyn, NY"
                onChange={handleChange}
                onBlur={handleBlur}
                hasError={!!touched.location && !!errors.location}
              />
              <Input
                label="Email"
                name="email"
                type="email"
                placeholder="Enter your email address to mark your review as verified"
                onChange={handleChange}
                onBlur={handleBlur}
                hasError={!!touched.email && !!errors.email}
              />

              <div>
                <input
                  type="checkbox"
                  name="terms"
                  id="terms"
                  className="h-4 w-4 mr-3"
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                <Label
                  htmlFor="terms"
                  hasError={!!touched.terms && !!errors.terms}
                >
                  I agree with the terms and privacy policy
                </Label>
              </div>

              <div>
                <button
                  type="submit"
                  className={`py-3 px-[15px] min-h-[44px] flex justify-center items-center hover:bg-green-600  bg-black  min-w-[2.75rem] transition-colors duration-200  relative mb-4 text-sm font-bold    text-center ${
                    isSubmitting ? "text-black" : "text-white"
                  }`}
                >
                  {isSubmitting && (
                    <span className="absolute inset-0 flex justify-center items-center">
                      <Dots className="bg-white" />
                    </span>
                  )}
                  Submit Review
                </button>
              </div>
            </div>
          </Form>
        );
      }}
    </Formik>
  );
};

export default ReviewForm;
