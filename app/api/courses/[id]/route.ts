import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb"
import { Course } from "@/types/course";

// GET: Retrieve a course by ID
export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> } // Await params
) {
  try {
    const { id } = await context.params; // Await params before accessing
    const courseId = parseInt(id, 10);

    if (isNaN(courseId)) {
      return NextResponse.json(
        { error: "Invalid course ID." },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("coursesDB");
    const courses = await db.collection("courses").find({}).toArray();
    const course = courses.find((c) => c.id === courseId);

    if (!course) {
      return NextResponse.json({ error: "Course not found." }, { status: 404 });
    }

    return NextResponse.json(course, { status: 200 });
  } catch (error) {
    console.error("Error retrieving course:", error);
    return NextResponse.json(
      { error: "Failed to retrieve course." },
      { status: 500 }
    );
  }
}

// // PUT: Update a course by ID
// export async function PUT(
//   request: Request,
//   context: { params: Promise<{ id: string }> } // Await params
// ) {
//   try {
//     const { id } = await context.params; // Await params before accessing
//     const courseId = parseInt(id, 10);
//     if (isNaN(courseId)) {
//       return NextResponse.json(
//         { error: "Invalid course ID." },
//         { status: 400 }
//       );
//     }
    
//     const updatedCourse: Partial<Course> = await request.json();
//     const client = await clientPromise;
//     const db = client.db("coursesDB");
    
//     if ("_id" in updatedCourse) {
//       delete updatedCourse._id;
//     }

//     const result = await db.collection("courses").findOneAndUpdate(
//       { id: courseId },
//       { $set: updatedCourse },
//       { returnDocument: "after" }
//     );

//     if (!result){
//       console.error("No document found for id:", courseId, "Result:", JSON.stringify(result));
//       throw new Error("Update Failed" + result);
//     }

//       return NextResponse.json(result.value, { status: 200 });
//     } catch (error) {
//       console.error("Error updating course:", error);
//       return NextResponse.json(
//         { error: "Failed to update course." },
//         { status: 500 }
//       );
//     }
//   }

  export async function PUT(
    request: Request,
    context: { params: Promise<{ id: string }> }
  ) {
    try {
      const { id } = await context.params;
      const courseId = parseInt(id, 10);
      if (isNaN(courseId)) {
        return NextResponse.json(
          { error: "Invalid course ID." },
          { status: 400 }
        );
      }
      
      const updatedCourse: Partial<Course> = await request.json();
      const client = await clientPromise;
      const db = client.db("coursesDB");
      
      if ("_id" in updatedCourse) {
        delete updatedCourse._id;
      }
  
      const result = await db.collection("courses").findOneAndUpdate(
        { id: courseId },
        { $set: updatedCourse },
        { returnDocument: "after" }
      );
  
      // Use result.value if available, otherwise result
      const updatedDocument = result?.value ?? result;
  
      if (!updatedDocument) {
        console.error("No document found for id:", courseId, "Result:", JSON.stringify(result));
        return NextResponse.json({ error: "Course not found." }, { status: 404 });
      }
  
      return NextResponse.json(updatedDocument, { status: 200 });
    } catch (error) {
      console.error("Error updating course:", error);
      return NextResponse.json(
        { error: "Failed to update course." },
        { status: 500 }
      );
    }
  }
// DELETE: Remove a course by ID
export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> } // Await params
) {
  try {
    const { id } = await context.params; // Await params before accessing
    const courseId = parseInt(id, 10);
    if (isNaN(courseId)) {
      return NextResponse.json(
        { error: "Invalid course ID." },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("coursesDB");
    const result = db.collection("courses").findOneAndDelete({id: courseId});

    if (!result){
      throw new Error("Delete failed");
    }

    return NextResponse.json(
      { message: `Course with ID ${courseId} deleted.` },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting course:", error);
    return NextResponse.json(
      { error: "Failed to delete course." },
      { status: 500 }
    );
  }
}
