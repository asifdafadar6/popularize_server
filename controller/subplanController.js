const subplan = require('../models/subplan')

class subplanController {
    
    static createSubplan = async (req, res) => {
        const body = req.body;
        try {

            if (!body.subplanname || !body.subplandetails || !body.subsellingprice) {
                return res.status(404).json({ msg: "Please provide all fields", success: false })
            }

            const insertsubplan = await subplan.create({
                ...body,
            });

            return res.status(201).json({
                msg: "Plan Created Successfully",
                success: true,
                insertedSubData: insertsubplan
            });
        }
        catch (err) {
            console.error(err);
            res.status(500).json({ msg: "Something wrong is happened in the backend" });
        }
    }

    static getAllSubPlans = async (req, res) => {
        try {
            const allSubplans = await subplan.find().populate("planId", "planname plantype");
            res.status(200).json({ success: true, data: allSubplans });
        } catch (err) {
            console.error("Error fetching subplans:", err);
            res.status(500).json({ msg: err.message || "Internal Server Error" });
        }
    };

    static getAllSubPlansById = async (req, res) => {
        try {
            const { id } = req.params;
            const singleSubplan = await subplan.findById(id).populate("planId", "planname plantype");

            if (!singleSubplan) {
                return res.status(404).json({ msg: "Subplan not found", success: false });
            }

            res.status(200).json({ success: true, data: singleSubplan });
        } catch (err) {
            console.error("Error fetching subplan:", err);
            res.status(500).json({ msg: err.message || "Internal Server Error" });
        }
    };

    static editSubPlans = async (req, res) => {
        try {
            const { id } = req.params;
            const updatedData = req.body;

            const updatedSubplan = await subplan.findByIdAndUpdate(id, updatedData, { new: true });

            if (!updatedSubplan) {
                return res.status(404).json({ msg: "Subplan not found", success: false });
            }

            res.status(200).json({ success: true, msg: "Subplan updated successfully", data: updatedSubplan });
        } catch (err) {
            console.error("Error updating subplan:", err);
            res.status(500).json({ msg: err.message || "Internal Server Error" });
        }
    };

    static planbyid = async (req, res) => {
        try {
            const { planId } = req.params;
            console.log('plan id:', planId);
            
            const singleSubplan = await subplan.findById(planId)
            // .populate("planId", "planname plantype");
console.log('single sub plan:', singleSubplan);

            if (!singleSubplan) {
                return res.status(404).json({ msg: "Subplan not found", success: false });
            }

            res.status(200).json({ success: true, data: singleSubplan });
        } catch (err) {
            console.error("Error fetching subplan:", err);
            res.status(500).json({ msg: err.message || "Internal Server Error" });
        }
    };

    static deleteSubPlans = async (req, res) => {
        try {
            const { id } = req.params;
            const deletedSubplan = await subplan.findByIdAndDelete(id);

            if (!deletedSubplan) {
                return res.status(404).json({ msg: "Subplan not found", success: false });
            }

            res.status(200).json({ success: true, msg: "Subplan deleted successfully" });
        } catch (err) {
            console.error("Error deleting subplan:", err);
            res.status(500).json({ msg: err.message || "Internal Server Error" });
        }
    };
}

module.exports = subplanController;