const express = require('express')
const app = express()
const router = express('router')
const fileOperationRoutes = require('./fileOperation.route')

app.use('/api/v1/fileOperation', fileOperationRoutes);

// app.post("/flatten-bom", (req, res) => {
//     try {
//         const input = req.body;
//         let flattened = [];

//         function processItem(item, level = "0") {
//             // If the item has MEP details, each entry should be a separate row
            
//             if(level >= 2){
//                 for(let i= 0;i<level;i++){
//                     if (item.MEP) {
//                         item.MEP.forEach((mep) => {
//                             flattened.push({
//                                 ...extractBaseItem(item, i),
//                                 ...extractMEP(mep),
//                             });
//                         });
//                     } else {
//                         // If no MEP details, just push the base item
//                         flattened.push(extractBaseItem(item, i));
//                     }
//                 }
//             }
//             else{
//                     if (item.MEP) {
//                         item.MEP.forEach((mep) => {
//                             flattened.push({
//                                 ...extractBaseItem(item, level),
//                                 ...extractMEP(mep),
//                             });
//                         });
//                     } else {
//                         // If no MEP details, just push the base item
//                         flattened.push(extractBaseItem(item, level));
//                     }
//             }
            

//             // Process BOM recursively
//             if (item.BOM) {
//                 item.BOM.forEach((child) => {
//                     processItem(child, child.Level);
//                 });
//             }

//             // Process MEP Details inside BOM items
//             if (item["MEP Details"]) {
//                 item["MEP Details"].forEach((mep) => {
//                     flattened.push({
//                         ...extractBaseItem(item, level),
//                         ...extractMEP(mep),
//                     });
//                 });
//             }
//         }

//         function extractBaseItem(item, level) {
//             return {
//                 "Item Revision": item["Item Revision"],
//                 "Item Reference": item["Item Reference"],
//                 "Self FMD Material": item["Self FMD Material"],
//                 "Quantity": item["Quantity"],
//                 "Level": level,
//                 "Item Type": item["Item Type"],
//                 "Item Owner": item["Item Owner"],
//                 "Environmental Compliance": item["Environmental Compliance"],
//                 "Item Description": item["Item Description"],
//             };
//         }

//         function extractMEP(mep) {
//             return {
//                 "Part Description": mep["Part Description"],
//                 "Supplier Reference": mep["Supplier Reference"],
//                 "Part Reference": mep["Part Reference"],
//             };
//         }

//         // Start processing
//         if (input["Realized Changes"]) {
//             input["Realized Changes"].forEach((rootItem) => processItem(rootItem));
//         }

//         res.json(flattened);
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// });

// // API endpoint
// app.post('/flatten-bom', (req, res) => {
//     if (!req.body || !req.body["Realized Changes"]) {
//         return res.status(400).json({ error: "Invalid input format" });
//     }
//     const flattenedResult = flattenBOM(req.body["Realized Changes"], 0);
//     res.json(flattenedResult);
// });


module.exports = app;