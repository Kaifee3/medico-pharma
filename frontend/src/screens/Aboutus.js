import React from 'react';
import AddReactionIcon from '@mui/icons-material/AddReaction';
import SubdirectoryArrowRightTwoToneIcon from '@mui/icons-material/SubdirectoryArrowRightTwoTone';
import LocalHospitalTwoToneIcon from '@mui/icons-material/LocalHospitalTwoTone';

const Aboutus = () => {
  return (
    <>
      <div className="bg-gray-100 min-h-screen p-8 relative">
        {/* Catchy Title */}
        <div className="text-center mb-8">
          <h4 className="text-2xl md:text-3xl font-extrabold text-blue-600 underline flex items-center justify-center gap-2">
            <AddReactionIcon className="text-yellow-500" />
            Laughter is the Best Medicine, but We've Got the Second Best...
          </h4>
        </div>

        {/* About Us Section */}
        <div className="max-w-screen-xl mx-auto text-center">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-8 underline">
            About Us
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
            {/* Mission */}
            <div>
              <h2 className="text-xl font-semibold text-red-600 mb-4 flex items-center gap-2">
                <LocalHospitalTwoToneIcon /> Our Mission
              </h2>
              <p className="text-gray-700 leading-relaxed">
                At <span className="font-bold text-blue-600">Easypharma</span>, our mission is to
                redefine global healthcare through innovation, patient-centered
                solutions, and unwavering ethical standards. We are committed to
                developing cutting-edge pharmaceuticals that not only address
                current healthcare needs but also anticipate the challenges of
                the future.
              </p>
              <p className="text-gray-700 leading-relaxed mt-4">
                Beyond science, we are deeply committed to ethical integrity —
                ensuring transparency, trust, and compliance in everything we
                do. Our goal is to make quality healthcare accessible worldwide,
                bridging gaps and promoting equality in healthcare outcomes.
              </p>
            </div>

            {/* Image */}
            <div className="md:flex md:items-center">
              <img
                src="https://images.unsplash.com/photo-1617881770125-6fb0d039ecde?w=500&auto=format&fit=crop&q=60"
                alt="About Pharma Store"
                className="w-full h-auto md:w-96 mx-auto rounded-lg shadow-md"
              />
            </div>
          </div>

          {/* Benefits */}
          <div className="mt-12">
            <h2 className="text-2xl font-semibold text-red-600 mb-6">
              Our Pharmacy Benefits
            </h2>
            <ul className="space-y-3 text-gray-700 text-lg text-left max-w-lg mx-auto">
              <li className="flex items-center gap-2">
                <SubdirectoryArrowRightTwoToneIcon /> Health at Your Fingertips
              </li>
              <li className="flex items-center gap-2">
                <SubdirectoryArrowRightTwoToneIcon /> Confidential Care,
                Conveniently Delivered
              </li>
              <li className="flex items-center gap-2">
                <SubdirectoryArrowRightTwoToneIcon /> Empowering Wellness
                through Information
              </li>
              <li className="flex items-center gap-2">
                <SubdirectoryArrowRightTwoToneIcon /> Seamless Medication
                Management
              </li>
              <li className="flex items-center gap-2">
                <SubdirectoryArrowRightTwoToneIcon /> 24/7 Health Support
              </li>
            </ul>
          </div>
        </div>

   
      </div>
    </>
  );
};

export default Aboutus;
