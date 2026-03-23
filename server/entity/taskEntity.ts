import { Entity, Column, CreateDateColumn, UpdateDateColumn, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { TaskStatus } from "../enum/taskStatus.ts";
import { User } from "./userEntity.ts";

@Entity()
export class Task {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column({ type: 'varchar' })
    title!: string;

    @Column({ type: 'text', nullable: true })
    description?: string | null;

    @ManyToOne(() => User, user => user.tasks)
    @JoinColumn({ name: 'userId' })
    user!: User;

    @Column({ type: 'enum', enum: TaskStatus, enumName: 'task_status' })
    status!: TaskStatus;

    @Column({ type: 'timestamp' })
    dueDate!: Date;

    @Column({ type: 'uuid' })
    userId!: string;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
}